"""Обязательные тесты формул из таблицы примеров PRD v3."""

from datetime import date

import pytest

from app import deposit, rating
from app.config import DEMO_TODAY
from app.rating import Components


def test_rating_without_history_is_start():
    assert rating.rating([], date(2026, 10, 1)) == 40


def test_rating_example_from_prd():
    c = Components(S=0.95, P=1, D=0.95, T=0.67, V=0.8, n=20, defaults_12m=0, disputes_lost=0)
    assert round(rating.raw_score(c), 1) == 91.2
    assert rating.rating_from_components(c) == 81


def test_rating_child_company_starts_from_parent():
    assert rating.rating([], date(2026, 10, 1), start=92) == 92


def test_rating_penalties_and_clamp():
    old = date(2024, 1, 1)
    deals = [rating.Deal("x", "default", False, False, DEMO_TODAY) for _ in range(10)]
    assert rating.rating(deals, old) == 0


@pytest.mark.parametrize(
    ("kwargs", "pct", "amount"),
    [
        ({"rating": 55, "amount": 18_000_000}, 10, 1_800_000),
        ({"rating": 92, "amount": 36_000_000}, 1, 360_000),
        ({"rating": 92, "amount": 150_000_000}, 3, 4_500_000),
        ({"rating": 40, "amount": 18_000_000, "guarantor_rating": 85}, 3, 540_000),
        ({"rating": 92, "amount": 36_000_000, "min_prepay_pct": 15}, 15, 5_400_000),
        ({"rating": 81, "amount": 600_000_000}, 6, 36_000_000),
    ],
)
def test_deposit_examples(kwargs, pct, amount):
    r = deposit.compute(**kwargs)
    assert r["pct"] == pct
    assert r["deposit_uzs"] == amount


def test_insurance_example():
    r = deposit.compute(rating=92, amount=36_000_000, insurance=True)
    assert r["deposit_uzs"] == 0
    assert r["fee_pct"] == 0.7
    assert r["fee_uzs"] == 252_000


def test_insurance_not_available_for_low_rating():
    with pytest.raises(ValueError):
        deposit.compute(rating=55, amount=18_000_000, insurance=True)


def test_fund_sustainability_example():
    assert deposit.fund_is_sustainable(default_rate_pct=5, loss_pct=20, fee_pct=1)
    assert not deposit.fund_is_sustainable(default_rate_pct=5, loss_pct=21, fee_pct=1)


def test_next_tier():
    assert deposit.next_tier(55) == (60, 6.0)
    assert deposit.next_tier(40) == (60, 6.0)
    assert deposit.next_tier(95) is None
