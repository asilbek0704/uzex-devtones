"""Pydantic-схемы входа API."""

from typing import Literal

from pydantic import BaseModel, Field


class RequestIn(BaseModel):
    buyer_id: str
    lot_id: str
    qty_t: int = Field(gt=0)
    guarantor_id: str | None = None
    payment_mode: Literal["deposit", "insurance"] = "deposit"


class RuleText(BaseModel):
    text: str = Field(min_length=1, max_length=500)


class Rule(BaseModel):
    min_rating: int | None = Field(default=None, ge=0, le=100)
    min_prepay_pct: float | None = Field(default=None, ge=0, le=100)
    newbie_max_volume_t: float | None = Field(default=None, gt=0)
    allow_pool: bool | None = None
    require_guarantor_below_rating: int | None = Field(default=None, ge=0, le=100)


class RuleSave(BaseModel):
    rule: Rule
    text: str | None = None
    source: Literal["ai", "template"] = "ai"
