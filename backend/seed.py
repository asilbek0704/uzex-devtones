"""Идемпотентное заполнение базы демо-данными PRD v3. Повторный запуск возвращает то же состояние.

Запуск: python seed.py
"""

import math
from datetime import date

from app import db
from app import rating as R

# Центры 14 регионов (приблизительно). Дорога ≈ 1,3 × прямая.
REGIONS = {
    "Город Ташкент": (41.311, 69.280),
    "Ташкентская область": (41.040, 69.360),
    "Андижанская область": (40.783, 72.344),
    "Ферганская область": (40.384, 71.786),
    "Наманганская область": (40.998, 71.672),
    "Сырдарьинская область": (40.490, 68.780),
    "Джизакская область": (40.116, 67.842),
    "Самаркандская область": (39.654, 66.976),
    "Кашкадарьинская область": (38.860, 65.790),
    "Сурхандарьинская область": (37.224, 67.278),
    "Бухарская область": (39.775, 64.429),
    "Навоийская область": (40.103, 65.379),
    "Хорезмская область": (41.550, 60.630),
    "Республика Каракалпакстан": (42.460, 59.600),
}
ROAD_FACTOR = 1.3


def road_km(a: str, b: str) -> int:
    (la1, lo1), (la2, lo2) = REGIONS[a], REGIONS[b]
    p1, p2 = math.radians(la1), math.radians(la2)
    dp, dl = p2 - p1, math.radians(lo2 - lo1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return int(round(2 * 6371 * math.asin(math.sqrt(h)) * ROAD_FACTOR))


# id, имя, роль, регион, родитель, дата регистрации, примечание
PARTICIPANTS = [
    ("cementprom", "ЦементПром", "seller", "Ташкентская область", None, "2022-01-10", "Склад цемента"),
    ("stroyplus", "СтройПлюс", "buyer", "Ферганская область", None, "2026-11-01", "Новичок, 0 сделок"),
    ("alisher", "Бригада Алишера", "buyer", "Ферганская область", None, "2026-10-20", "Новичок"),
    ("dilnoza", "Магазин Дилноза", "buyer", "Ферганская область", None, "2026-10-15", "Новичок"),
    ("megastroy", "МегаСтрой", "buyer", "Андижанская область", None, "2024-11-07", "20 сделок, 1 старый срыв"),
    ("nadezhny", "Надежный Строй", "buyer", "Город Ташкент", None, "2021-06-01", "40 успешных сделок"),
    ("ferganass", "ФерганаСтройСервис", "buyer", "Ферганская область", "nadezhny", "2026-09-01", "Дочерняя компания «Надежный Строй»"),
    ("somnitel", "СомнительТрейд", "both", "Город Ташкент", None, "2025-05-07", "Два срыва за год"),
    ("khorezm", "ХорезмСтрой", "buyer", "Хорезмская область", None, "2025-11-07", "Далеко от Ферганы"),
    ("tradelink", "ТрейдЛинк", "both", "Город Ташкент", None, "2025-04-01", "Партнер СомнительТрейд"),
]
# Контрагенты из истории сделок: на экранах не показываются, нужны для формулы.
SUPPLIERS = [(f"supplier{i}", f"Поставщик {i}", "seller", "Город Ташкент") for i in range(1, 10)]
CUSTOMERS = [(f"customer{i}", f"Покупатель {i}", "buyer", "Ташкентская область") for i in range(1, 8)]


def _months_back(n: int, base: date = date(2026, 9, 1)) -> str:
    y, m = base.year, base.month - n
    while m <= 0:
        y, m = y - 1, m + 12
    return date(y, m, 1).isoformat()


def build_deals() -> list[tuple]:
    """(buyer, seller, сумма, статус, вовремя оплата, вовремя поставка, дата)."""
    deals = []
    ok = ("success", 1, 1)

    # ЦементПром: 30 продаж без срывов 7 покупателям -> рейтинг 88.
    for i in range(30):
        deals.append((f"customer{i % 7 + 1}", "cementprom", 45_000_000, *ok, _months_back(i + 1)))

    # МегаСтрой: 20 сделок, 8 поставщиков, 1 срыв старше 12 месяцев -> рейтинг 81.
    for i in range(19):
        deals.append(("megastroy", f"supplier{i % 8 + 1}", 12_000_000, *ok, _months_back(i % 20 + 1)))
    deals.append(("megastroy", "supplier8", 12_000_000, "default", 1, 0, "2025-03-01"))

    # Надежный Строй: 40 успешных сделок, 9 поставщиков -> рейтинг 92.
    for i in range(40):
        deals.append(("nadezhny", f"supplier{i % 9 + 1}", 30_000_000, *ok, _months_back(i + 1)))

    # ХорезмСтрой: 5 сделок, 3 поставщика, срыв старше года, поздние поставки -> рейтинг 50.
    kh = [
        ("success", 1, 1),
        ("success", 1, 0),
        ("success", 1, 0),
        ("success", 1, 1),
        ("default", 0, 0),
    ]
    for i, (st, paid, deliv) in enumerate(kh):
        when = "2025-10-01" if st == "default" else _months_back(i + 1)
        deals.append(("khorezm", f"supplier{i % 3 + 1}", 8_000_000, st, paid, deliv, when))

    # СомнительТрейд: 10 сделок только с ТрейдЛинк в обе стороны, 2 срыва за год -> рейтинг 22.
    st_specs = [
        ("success", 1, 1),
        ("success", 1, 1),
        ("success", 1, 0),
        ("success", 0, 1),
        ("success", 1, 1),
        ("success", 1, 0),
        ("success", 0, 1),
        ("success", 1, 1),
        ("default", 0, 0),
        ("default", 0, 0),
    ]
    for i, (st, paid, deliv) in enumerate(st_specs):
        when = ["2026-05-01", "2026-08-01"][i - 8] if st == "default" else _months_back(i + 1, date(2026, 4, 1))
        buyer, seller = ("somnitel", "tradelink") if i % 2 == 0 else ("tradelink", "somnitel")
        deals.append((buyer, seller, 20_000_000, st, paid, deliv, when))
    return deals


LOTS = [
    {
        "id": "lot-cement",
        "seller_id": "cementprom",
        "product": "Портландцемент",
        "grade": "М400",
        "volume_t": 100,
        "price_per_t": 900_000,
        "region": "Ташкентская область",
        "deadline": "2026-11-25",
        "pool_allowed": 1,
        "min_fill_pct": 90,
        "rules": {"min_rating": 40},
        "rules_text": "Пускать от рейтинга 40",
    },
    {
        "id": "lot-sugar",
        "seller_id": "cementprom",
        "product": "Сахар белый",
        "grade": "Высший сорт",
        "volume_t": 40,
        "price_per_t": 8_000_000,
        "region": "Ташкентская область",
        "deadline": "2026-11-30",
        "pool_allowed": 0,
        "min_fill_pct": 90,
        "rules": {"min_rating": 70},
        "rules_text": "Пускать от рейтинга 70",
    },
]

# Открытые заявки на цемент: id, покупатель, тонны, нужно к дате, цена заявки за тонну.
REQUESTS = [
    ("req-1", "stroyplus", 20, "2026-11-20", 900_000),
    ("req-2", "alisher", 25, "2026-11-20", 900_000),
    ("req-3", "dilnoza", 30, "2026-11-22", 900_000),
    ("req-4", "megastroy", 15, "2026-11-22", 900_000),
    ("req-5", "khorezm", 10, "2026-11-24", 900_000),
    ("req-6", "nadezhny", 10, "2026-11-24", 900_000),
    ("req-7", "somnitel", 8, "2026-11-24", 700_000),
]


def recompute_rating(conn, pid: str) -> int:
    """Пересчитывает рейтинг по истории и пишет снимок."""
    p = conn.execute("SELECT * FROM participants WHERE id=?", (pid,)).fetchone()
    deals = participant_deals(conn, pid)
    start = 40
    if p["parent_id"]:
        parent = conn.execute("SELECT value FROM rating_snapshots WHERE participant_id=?", (p["parent_id"],)).fetchone()
        start = parent["value"] if parent else 40
    comps = R.components(deals, date.fromisoformat(p["created_at"]))
    value = R.rating_from_components(comps, start)
    conn.execute(
        "INSERT OR REPLACE INTO rating_snapshots (participant_id, value, components, updated_at) VALUES (?,?,?,?)",
        (pid, value, db.dumps(R.components_json(comps, value, start)), db.now_iso()),
    )
    return value


def participant_deals(conn, pid: str) -> list[R.Deal]:
    rows = conn.execute(
        "SELECT * FROM deal_history WHERE buyer_id=? OR seller_id=? ORDER BY id", (pid, pid)
    ).fetchall()
    return [
        R.Deal(
            counterparty_id=r["seller_id"] if r["buyer_id"] == pid else r["buyer_id"],
            status=r["status"],
            paid_on_time=bool(r["paid_on_time"]),
            delivered_on_time=bool(r["delivered_on_time"]),
            created_at=date.fromisoformat(r["created_at"]),
        )
        for r in rows
    ]


def seed(conn) -> None:
    db.init_schema(conn)
    for t in db.DEMO_TABLES:
        conn.execute(f"DELETE FROM {t}")
    conn.execute("DELETE FROM sqlite_sequence WHERE name='decisions_log'") if conn.execute(
        "SELECT 1 FROM sqlite_master WHERE name='sqlite_sequence'"
    ).fetchone() else None

    names = list(REGIONS)
    for a in names:
        for b in names:
            if a != b:
                conn.execute("INSERT INTO region_distance VALUES (?,?,?)", (a, b, road_km(a, b)))

    for pid, name, role, region, parent, created, note in PARTICIPANTS:
        conn.execute(
            "INSERT INTO participants VALUES (?,?,?,?,?,?,?)", (pid, name, role, region, parent, created, note)
        )
    for pid, name, role, region in SUPPLIERS + CUSTOMERS:
        conn.execute(
            "INSERT INTO participants VALUES (?,?,?,?,?,?,?)", (pid, name, role, region, None, "2022-01-01", "history")
        )

    for i, d in enumerate(build_deals(), start=1):
        conn.execute("INSERT INTO deal_history VALUES (?,?,?,?,?,?,?,?)", (f"deal-{i:03d}", *d))

    # Сначала материнские компании: дочерняя стартует с их рейтинга.
    ids = [r["id"] for r in conn.execute("SELECT id FROM participants ORDER BY parent_id IS NOT NULL, id")]
    for pid in ids:
        recompute_rating(conn, pid)

    for lot in LOTS:
        conn.execute(
            "INSERT INTO lots VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
            (
                lot["id"],
                lot["seller_id"],
                lot["product"],
                lot["grade"],
                lot["volume_t"],
                lot["price_per_t"],
                lot["region"],
                lot["deadline"],
                lot["pool_allowed"],
                lot["min_fill_pct"],
                db.dumps(_full_rule(lot["rules"])),
                lot["rules_text"],
            ),
        )

    for rid, buyer, qty, deadline, bid in REQUESTS:
        region = conn.execute("SELECT region FROM participants WHERE id=?", (buyer,)).fetchone()["region"]
        conn.execute(
            "INSERT INTO requests VALUES (?,?,?,?,?,?,?,?,?,?,?)",
            (rid, buyer, "lot-cement", qty, region, deadline, "deposit", None, bid, "submitted", "2026-11-05T10:00:00"),
        )


def _full_rule(rule: dict) -> dict:
    from app.rules import normalize_rule

    return normalize_rule(rule)


def main() -> None:
    with db.session() as conn:
        seed(conn)
        rows = conn.execute(
            "SELECT p.name, r.value FROM participants p JOIN rating_snapshots r ON r.participant_id=p.id "
            "WHERE p.note IS NOT 'history' ORDER BY p.rowid"
        ).fetchall()
    print("База заполнена:", db.DB_PATH)
    for r in rows:
        print(f"  {r['name']}: рейтинг {r['value']}")


if __name__ == "__main__":
    main()
