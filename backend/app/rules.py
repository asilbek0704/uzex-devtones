"""Правила продавца: допуск заявки и оценка риска. Чистые функции, решает код, а не ИИ."""

from . import config as C
from .rating import is_newbie

RULE_FIELDS = ("min_rating", "min_prepay_pct", "newbie_max_volume_t", "allow_pool", "require_guarantor_below_rating")


def normalize_rule(rule: dict | None) -> dict:
    """Поля, которые продавец не задал, равны null."""
    rule = rule or {}
    return {k: rule.get(k) for k in RULE_FIELDS}


def describe_rule(rule: dict) -> list[str]:
    """Правило в понятном виде, по одной строке на условие."""
    r = normalize_rule(rule)
    out = []
    if r["min_rating"] is not None:
        out.append(f"Рейтинг покупателя от {r['min_rating']}")
    if r["newbie_max_volume_t"] is not None:
        out.append(f"Новичкам (меньше {C.NEWBIE_MAX_DEALS} сделок) не больше {_t(r['newbie_max_volume_t'])} т")
    if r["min_prepay_pct"]:
        out.append(f"Минимальная предоплата {_num(r['min_prepay_pct'])}%")
    if r["require_guarantor_below_rating"] is not None:
        out.append(f"Поручитель обязателен при рейтинге ниже {r['require_guarantor_below_rating']}")
    if r["allow_pool"] is False:
        out.append("Покупка пулом запрещена")
    elif r["allow_pool"] is True:
        out.append("Покупка пулом разрешена")
    return out


def admit(
    rule: dict | None,
    buyer_rating: int,
    buyer_deals: int,
    qty_t: float,
    lot_volume_t: float,
    pool_allowed: bool,
    guarantor_rating: int | None = None,
) -> dict:
    """Допуск по правилам в порядке PRD: рейтинг, объем новичка, поручитель.

    Пока действует поручительство, продавец видит рейтинг поручителя,
    поэтому для правила «рейтинг от N» берется рейтинг поручителя.
    """
    r = normalize_rule(rule)
    effective = guarantor_rating if guarantor_rating is not None else buyer_rating
    newbie = is_newbie(buyer_deals)
    reasons: list[dict] = []
    options: list[dict] = []
    pool_ok = pool_allowed and r["allow_pool"] is not False

    if qty_t > lot_volume_t:
        reasons.append(
            {
                "code": "volume_exceeds_lot",
                "message": f"Объем {_t(qty_t)} т больше всего лота ({_t(lot_volume_t)} т)",
            }
        )
        options.append({"code": "smaller_volume", "message": f"Уменьшить объем до {_t(lot_volume_t)} т", "max_t": lot_volume_t})

    if r["min_rating"] is not None and effective < r["min_rating"]:
        gap = r["min_rating"] - effective
        reasons.append(
            {
                "code": "rule_min_rating",
                "message": f"Рейтинг {effective} ниже {r['min_rating']}, а продавец пускает от {r['min_rating']}",
                "rating": effective,
                "min_rating": r["min_rating"],
            }
        )
        if guarantor_rating is None:
            options.append(
                {
                    "code": "guarantor",
                    "message": f"Найти поручителя с рейтингом от {max(C.GUARANTOR_MIN_RATING, r['min_rating'])}",
                }
            )
        options.append({"code": "improve_rating", "message": f"Поднять рейтинг на {gap} баллов честными сделками", "points": gap})

    if newbie and r["newbie_max_volume_t"] is not None and qty_t > r["newbie_max_volume_t"]:
        reasons.append(
            {
                "code": "rule_newbie_volume",
                "message": f"Продавец не продает новичкам больше {_t(r['newbie_max_volume_t'])} т, а в заявке {_t(qty_t)} т",
                "max_t": r["newbie_max_volume_t"],
            }
        )
        options.append(
            {
                "code": "smaller_volume",
                "message": f"Уменьшить объем до {_t(r['newbie_max_volume_t'])} т",
                "max_t": r["newbie_max_volume_t"],
            }
        )
        if pool_ok:
            options.append({"code": "pool", "message": "Купить вместе с соседями в пуле"})

    threshold = r["require_guarantor_below_rating"]
    if threshold is not None and buyer_rating < threshold and guarantor_rating is None:
        reasons.append(
            {
                "code": "rule_guarantor_required",
                "message": f"При рейтинге ниже {threshold} продавец требует поручителя",
            }
        )
        options.append({"code": "guarantor", "message": f"Найти поручителя с рейтингом от {C.GUARANTOR_MIN_RATING}"})

    options = _unique(options)
    return {
        "admitted": not reasons,
        "status": "admitted" if not reasons else "rejected",
        "effective_rating": effective,
        "is_newbie": newbie,
        "reasons": reasons,
        "options": options if reasons else [],
    }


def find_chain(buyer_id: str, edges: list[tuple[str, str]]) -> list[str] | None:
    """Замкнутая цепочка взаимных сделок из 2-3 участников, в которой есть покупатель.

    edges: пары (продавец, покупатель) из истории сделок.
    """
    out: dict[str, set[str]] = {}
    for seller, buyer in edges:
        out.setdefault(seller, set()).add(buyer)
    for x in sorted(out.get(buyer_id, ())):
        if x != buyer_id and buyer_id in out.get(x, ()):
            return [buyer_id, x]
    for x in sorted(out.get(buyer_id, ())):
        for y in sorted(out.get(x, ())):
            if len({buyer_id, x, y}) == 3 and buyer_id in out.get(y, ()):
                return [buyer_id, x, y]
    return None


def risk(
    *,
    buyer_deals: int,
    amount_uzs: int,
    bid_price_per_t: int,
    lot_price_per_t: int,
    buyer_share_pct: float,
    chain: list[str] | None,
    chain_names: list[str] | None = None,
) -> dict:
    """Оценка риска заявки. На допуск не влияет."""
    signals: list[dict] = []
    if buyer_share_pct > C.RISK_SHARE_OF_SELLER_PCT:
        signals.append(
            {
                "code": "seller_share",
                "points": C.RISK_SHARE_POINTS,
                "message": f"Покупатель берет {round(buyer_share_pct)}% объема продавца за {C.RISK_SHARE_WINDOW_DAYS} дней",
            }
        )
    below = (lot_price_per_t - bid_price_per_t) / lot_price_per_t * 100 if lot_price_per_t else 0
    if below > C.RISK_PRICE_BELOW_PCT:
        signals.append(
            {
                "code": "low_price",
                "points": C.RISK_PRICE_POINTS,
                "message": f"Цена заявки на {round(below)}% ниже цены лота",
            }
        )
    if chain:
        names = chain_names or chain
        signals.append(
            {
                "code": "closed_chain",
                "points": C.RISK_CHAIN_POINTS,
                "message": "Замкнутая цепочка взаимных сделок: " + " и ".join(names),
            }
        )
    if is_newbie(buyer_deals) and amount_uzs > C.RISK_NEWBIE_AMOUNT_UZS:
        signals.append(
            {
                "code": "newbie_large",
                "points": C.RISK_NEWBIE_AMOUNT_POINTS,
                "message": f"Новичок, а заявка больше {C.RISK_NEWBIE_AMOUNT_UZS // 1_000_000} млн сум",
            }
        )
    score = sum(s["points"] for s in signals)
    level = "high" if score >= C.RISK_HIGH_FROM else "medium" if score >= C.RISK_MEDIUM_FROM else "low"
    return {"score": score, "level": level, "signals": signals}


def _unique(options: list[dict]) -> list[dict]:
    seen, out = set(), []
    for o in options:
        key = (o["code"], o.get("max_t"))
        if key not in seen:
            seen.add(key)
            out.append(o)
    return out


def _t(v: float) -> str:
    return _num(v)


def _num(v: float) -> str:
    return str(int(v)) if float(v).is_integer() else str(v).replace(".", ",")
