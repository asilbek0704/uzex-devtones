"""Рейтинг доверия 0-100. Чистые функции: без базы данных и без ИИ."""

from dataclasses import dataclass
from datetime import date

from . import config as C


@dataclass(frozen=True)
class Deal:
    """Одна завершенная сделка с точки зрения участника."""

    counterparty_id: str
    status: str  # success / default / dispute_lost
    paid_on_time: bool
    delivered_on_time: bool
    created_at: date


@dataclass(frozen=True)
class Components:
    S: float
    P: float
    D: float
    T: float
    V: float
    n: int
    defaults_12m: int
    disputes_lost: int


def months_between(start: date, end: date) -> int:
    return max(0, (end.year - start.year) * 12 + (end.month - start.month) - (end.day < start.day))


def components(deals: list[Deal], registered_at: date, today: date = C.DEMO_TODAY) -> Components:
    n = len(deals)
    if n == 0:
        S = P = D = 0.0
    else:
        S = sum(d.status == "success" for d in deals) / n
        P = sum(d.paid_on_time for d in deals) / n
        D = sum(d.delivered_on_time for d in deals) / n
    T = min(months_between(registered_at, today) / C.TENURE_FULL_MONTHS, 1.0)
    V = min(len({d.counterparty_id for d in deals}) / C.PARTNERS_FULL, 1.0)
    defaults_12m = sum(
        d.status == "default" and (today - d.created_at).days <= C.PENALTY_WINDOW_DAYS for d in deals
    )
    disputes_lost = sum(d.status == "dispute_lost" for d in deals)
    return Components(S, P, D, T, V, n, defaults_12m, disputes_lost)


def raw_score(c: Components) -> float:
    w = C.RATING_WEIGHTS
    return 100 * (w["S"] * c.S + w["P"] * c.P + w["D"] * c.D + w["T"] * c.T + w["V"] * c.V)


def rating_from_components(c: Components, start: int = C.RATING_START) -> int:
    if c.n == 0:
        return int(start)
    w = c.n / (c.n + C.HISTORY_SMOOTHING)
    value = w * raw_score(c) + (1 - w) * start
    value -= C.PENALTY_DEFAULT * c.defaults_12m + C.PENALTY_DISPUTE_LOST * c.disputes_lost
    return int(min(100, max(0, round(value))))


def rating(deals: list[Deal], registered_at: date, start: int = C.RATING_START, today: date = C.DEMO_TODAY) -> int:
    return rating_from_components(components(deals, registered_at, today), start)


def is_newbie(completed_deals: int) -> bool:
    return completed_deals < C.NEWBIE_MAX_DEALS


def rating_after_next_success(
    deals: list[Deal], registered_at: date, start: int = C.RATING_START, today: date = C.DEMO_TODAY
) -> int:
    """Каким станет рейтинг после еще одной успешной сделки вовремя с новым контрагентом."""
    extra = Deal("__next__", "success", True, True, today)
    return rating(deals + [extra], registered_at, start, today)


def components_json(c: Components, value: int, start: int) -> dict:
    """Расшифровка для экрана «из чего сложился рейтинг»."""
    w = C.RATING_WEIGHTS
    return {
        "S": round(c.S, 3),
        "P": round(c.P, 3),
        "D": round(c.D, 3),
        "T": round(c.T, 3),
        "V": round(c.V, 3),
        "n": c.n,
        "raw": round(raw_score(c), 1),
        "history_weight": round(c.n / (c.n + C.HISTORY_SMOOTHING), 3),
        "start": start,
        "penalties": C.PENALTY_DEFAULT * c.defaults_12m + C.PENALTY_DISPUTE_LOST * c.disputes_lost,
        "defaults_12m": c.defaults_12m,
        "disputes_lost": c.disputes_lost,
        "weights": w,
        "value": value,
    }
