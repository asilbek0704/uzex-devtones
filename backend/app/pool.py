"""Подбор пула и расчет доставки. Чистые функции: без базы данных и без ИИ."""

import math
from collections.abc import Callable
from dataclasses import dataclass, field

from . import config as C
from . import deposit as dep
from . import rules

Distance = Callable[[str, str], int]

# Сколько вариантов состава хранить на каждую сумму тонн в динамике.
_KEEP_PER_SUM = 24


@dataclass(frozen=True)
class Lot:
    id: str
    seller_id: str
    product: str
    grade: str
    volume_t: int
    price_per_t: int
    region: str
    deadline: str
    pool_allowed: bool
    min_fill_pct: int
    rule: dict = field(default_factory=dict)


@dataclass(frozen=True)
class OpenRequest:
    id: str
    buyer_id: str
    buyer_name: str
    buyer_rating: int
    buyer_deals: int
    product: str
    grade: str
    qty_t: int
    region: str
    deadline: str


def trip_cost(km: float) -> int:
    return C.TRIP_BASE_UZS + C.TRIP_PER_KM_UZS * int(round(km))


def region_km(dist: Distance, a: str, b: str) -> int:
    return C.SAME_REGION_KM if a == b else dist(a, b)


def greedy_route(start: str, stops: list[OpenRequest], dist: Distance) -> tuple[list[dict], int]:
    """От склада к ближайшему участнику, затем к ближайшему из оставшихся."""
    left = list(stops)
    here, total, legs = start, 0, []
    while left:
        nxt = min(left, key=lambda r: (region_km(dist, here, r.region), r.id))
        km = region_km(dist, here, nxt.region)
        legs.append({"request_id": nxt.id, "buyer_name": nxt.buyer_name, "region": nxt.region, "km": km})
        total += km
        here = nxt.region
        left.remove(nxt)
    return legs, total


def delivery(lot: Lot, members: list[OpenRequest], dist: Distance) -> dict:
    """Доставка в одиночку и в пуле; выгода — разница по каждому участнику."""
    total_t = sum(m.qty_t for m in members)
    legs, route_km = greedy_route(lot.region, members, dist)
    trips = math.ceil(total_t / C.TRUCK_CAPACITY_T)
    pool_cost = trips * trip_cost(route_km)

    per_member = []
    allocated = 0
    for i, m in enumerate(members):
        alone_trips = math.ceil(m.qty_t / C.TRUCK_CAPACITY_T)
        alone_km = region_km(dist, lot.region, m.region)
        alone = alone_trips * trip_cost(alone_km)
        # Делим по тоннам; остаток от округления — последнему, чтобы сумма сошлась.
        share = pool_cost - allocated if i == len(members) - 1 else round(pool_cost * m.qty_t / total_t)
        allocated += share
        per_member.append(
            {
                "request_id": m.id,
                "alone_trips": alone_trips,
                "alone_km": alone_km,
                "alone_uzs": alone,
                "pool_share_uzs": share,
                "saving_uzs": alone - share,
            }
        )
    return {
        "route": legs,
        "route_km": route_km,
        "trips": trips,
        "pool_cost_uzs": pool_cost,
        "alone_cost_uzs": sum(p["alone_uzs"] for p in per_member),
        "per_member": per_member,
    }


def propose_pools(lot: Lot, open_requests: list[OpenRequest], dist: Distance) -> dict:
    """До трех предложений пула для лота. Шаги строго по PRD v3."""
    if not lot.pool_allowed or lot.rule.get("allow_pool") is False:
        return {"proposals": [], "excluded": [], "anchor_region": None, "reason": "pool_not_allowed"}

    excluded: list[dict] = []
    rule = rules.normalize_rule(lot.rule)

    # 1. Фильтр кандидатов: товар и сорт, срок, рейтинг и правила продавца.
    candidates = []
    for r in open_requests:
        if r.product != lot.product or r.grade != lot.grade:
            continue
        if r.deadline > lot.deadline:
            excluded.append(_ex(r, "deadline", f"Нужно к {r.deadline}, а лот только к {lot.deadline}"))
            continue
        adm = rules.admit(rule, r.buyer_rating, r.buyer_deals, r.qty_t, lot.volume_t, lot.pool_allowed)
        if not adm["admitted"]:
            excluded.append(_ex(r, "rules", "; ".join(x["message"] for x in adm["reasons"])))
            continue
        candidates.append(r)

    if not candidates:
        return {"proposals": [], "excluded": excluded, "anchor_region": None, "reason": "no_candidates"}

    # 2. Кластер по региону: якорь — регион самой большой заявки.
    anchor = min(candidates, key=lambda r: (-r.qty_t, _order(r))).region
    near = []
    for r in candidates:
        km = region_km(dist, anchor, r.region) if r.region != anchor else 0
        if km > C.POOL_MAX_DISTANCE_KM:
            excluded.append(_ex(r, "too_far", f"Слишком далеко: {km} км от региона пула ({anchor}), можно до {C.POOL_MAX_DISTANCE_KM} км"))
        else:
            near.append(r)

    # 3. Подбор состава: сумма подмножества по целым тоннам.
    min_fill = math.ceil(lot.volume_t * (lot.min_fill_pct or C.POOL_DEFAULT_MIN_FILL_PCT) / 100)
    subsets = _subset_sum(near, lot.volume_t)
    valid = [s for t, group in subsets.items() if min_fill <= t <= lot.volume_t for s in group]
    valid.sort(key=lambda s: _rank(s))
    best = valid[: C.POOL_MAX_PROPOSALS]

    if not best:
        got = max((t for t in subsets if t <= lot.volume_t), default=0)
        return {
            "proposals": [],
            "excluded": excluded,
            "anchor_region": anchor,
            "reason": "not_enough_volume",
            "max_collected_t": got,
            "min_fill_t": min_fill,
        }

    chosen_ids = {r.id for r in best[0]}
    for r in near:
        if r.id not in chosen_ids:
            excluded.append(_ex(r, "not_selected", "Не вошел в лучший состав пула"))

    proposals = [describe(lot, list(s), dist, min_fill) for s in best]
    return {"proposals": proposals, "excluded": excluded, "anchor_region": anchor, "reason": None, "min_fill_t": min_fill}


def describe(lot: Lot, members: list[OpenRequest], dist: Distance, min_fill_t: int | None = None) -> dict:
    """Ответ по составу: доли, залог каждого, маршрут и доставка."""
    members = sorted(members, key=_order)
    total_t = sum(m.qty_t for m in members)
    d = delivery(lot, members, dist)
    by_id = {p["request_id"]: p for p in d["per_member"]}
    out_members = []
    for m in members:
        amount = m.qty_t * lot.price_per_t
        deposit = dep.compute(m.buyer_rating, amount, min_prepay_pct=lot.rule.get("min_prepay_pct") or 0)
        out_members.append(
            {
                "request_id": m.id,
                "buyer_id": m.buyer_id,
                "buyer_name": m.buyer_name,
                "buyer_rating": m.buyer_rating,
                "region": m.region,
                "share_t": m.qty_t,
                "goods_uzs": amount,
                "deposit_pct": deposit["pct"],
                "deposit_uzs": deposit["deposit_uzs"],
                **{k: v for k, v in by_id[m.id].items() if k != "request_id"},
            }
        )
    return {
        "lot_id": lot.id,
        "total_t": total_t,
        "volume_t": lot.volume_t,
        "fill_pct": round(total_t / lot.volume_t * 100, 1),
        "min_fill_t": min_fill_t,
        "price_per_t": lot.price_per_t,
        "members": out_members,
        "route": d["route"],
        "route_km": d["route_km"],
        "trips": d["trips"],
        "pool_cost_uzs": d["pool_cost_uzs"],
        "alone_cost_uzs": d["alone_cost_uzs"],
        "saving_uzs": d["alone_cost_uzs"] - d["pool_cost_uzs"],
    }


def _subset_sum(items: list[OpenRequest], cap: int) -> dict[int, list[tuple[OpenRequest, ...]]]:
    """Динамика по целым тоннам: для каждой суммы — лучшие наборы до 8 участников."""
    dp: dict[int, list[tuple[OpenRequest, ...]]] = {0: [()]}
    for it in sorted(items, key=_order):
        q = int(it.qty_t)
        nxt = {t: list(g) for t, g in dp.items()}
        for t, group in dp.items():
            if t + q > cap:
                continue
            for s in group:
                if len(s) < C.POOL_MAX_MEMBERS:
                    nxt.setdefault(t + q, []).append(s + (it,))
        dp = {t: sorted(g, key=_rank)[:_KEEP_PER_SUM] for t, g in nxt.items()}
    dp.pop(0, None)
    return dp


def _rank(s: tuple[OpenRequest, ...]):
    """Больше тонн; при равенстве меньше участников, затем выше средний рейтинг."""
    total = sum(r.qty_t for r in s)
    avg = sum(r.buyer_rating for r in s) / len(s) if s else 0
    return (-total, len(s), -avg, tuple(sorted(r.id for r in s)))


def _order(r: OpenRequest):
    return r.id


def _ex(r: OpenRequest, code: str, message: str) -> dict:
    return {
        "request_id": r.id,
        "buyer_id": r.buyer_id,
        "buyer_name": r.buyer_name,
        "qty_t": r.qty_t,
        "region": r.region,
        "code": code,
        "message": message,
    }
