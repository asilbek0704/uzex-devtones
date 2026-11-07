"""Все условные числа демо. Нигде больше не дублируются (PRD v3, «Стек и структура»)."""

from datetime import date

# Фиксированная дата демо: стаж, «последние 12 месяцев» и «30 дней» считаются от нее,
# поэтому результат одинаковый при каждом запуске.
DEMO_TODAY = date(2026, 11, 7)

# --- Рейтинг ---
RATING_WEIGHTS = {"S": 0.30, "P": 0.25, "D": 0.20, "T": 0.10, "V": 0.15}
RATING_START = 40
HISTORY_SMOOTHING = 5  # w = n / (n + 5)
TENURE_FULL_MONTHS = 36
PARTNERS_FULL = 10
PENALTY_DEFAULT = 15  # за каждый срыв за последние 12 месяцев
PENALTY_DISPUTE_LOST = 5  # за каждый проигранный спор
PENALTY_WINDOW_DAYS = 365
NEWBIE_MAX_DEALS = 3  # новичок: меньше 3 завершенных сделок

# --- Залог: (нижняя граница рейтинга, процент), по убыванию ---
DEPOSIT_TIERS = [(90, 1.0), (80, 3.0), (60, 6.0), (40, 10.0), (0, 15.0)]
GUARANTOR_MIN_RATING = 80
GUARANTOR_FLOOR_PCT = 3.0
GUARANTOR_MAX_ACTIVE = 3
ZERO_DEPOSIT_LIMIT_UZS = 100_000_000
ZERO_DEPOSIT_LIMIT_FLOOR_PCT = 3.0
LARGE_DEAL_LIMIT_UZS = 500_000_000
LARGE_DEAL_FLOOR_PCT = 6.0

# --- Страховка вместо залога ---
INSURANCE_MIN_RATING = 60
INSURANCE_MAX_AMOUNT_UZS = 300_000_000
INSURANCE_FEE_TIERS = [(90, 0.7), (80, 1.0), (60, 1.5)]
FUND_EXAMPLE = {"fee_pct": 1.0, "default_rate_pct": 5.0, "max_loss_pct": 20.0}

# --- Пул и доставка ---
POOL_MAX_DISTANCE_KM = 150
POOL_DEFAULT_MIN_FILL_PCT = 90
POOL_MAX_MEMBERS = 8
POOL_MAX_PROPOSALS = 3
TRIP_BASE_UZS = 300_000
TRIP_PER_KM_UZS = 1_500
TRUCK_CAPACITY_T = 25
SAME_REGION_KM = 20

# --- Оценка риска: баллы признаков и уровни ---
RISK_SHARE_OF_SELLER_PCT = 60
RISK_SHARE_WINDOW_DAYS = 30
RISK_SHARE_POINTS = 40
RISK_PRICE_BELOW_PCT = 15
RISK_PRICE_POINTS = 30
RISK_CHAIN_POINTS = 30
RISK_NEWBIE_AMOUNT_UZS = 50_000_000
RISK_NEWBIE_AMOUNT_POINTS = 20
RISK_MEDIUM_FROM = 30
RISK_HIGH_FROM = 60

# --- Claude ---
AI_TIMEOUT_S = 8.0
AI_MAX_RETRIES = 1
AI_DEFAULT_MODEL = "claude-opus-5-5"
