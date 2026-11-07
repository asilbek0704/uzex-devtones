# Контракт API «Биржи доверия»

> **Черновик v0.1** — предложение фронтенда. Бэкенд правит и подтверждает, после этого контракт меняем только по договорённости: любое изменение полей ломает фронт.

Покрывает экраны демо из PRD: каталог и заявку с залогом (экран 1), пул (экран 2), экран продавца (экран 3), профиль и переключатель персонажей.

## 1. Общие соглашения

| Что | Как |
|---|---|
| Базовый путь | Все маршруты под `/api` (dev-сервер фронта проксирует `/api/*` на `localhost:8000` без изменения пути) |
| Формат | JSON, ключи в **camelCase** (в Pydantic: `alias_generator=to_camel`, `populate_by_name=True`) |
| Кто запрашивает | Заголовок `X-Participant-Id: stroyplus` — id персонажа из переключателя. Настоящей авторизации нет |
| Язык | Заголовок `Accept-Language: ru` или `uz`. На этом языке приходят все тексты для пользователя: причины, пояснения ИИ, сообщения об ошибках |
| Деньги | Целые числа в сумах (`4500000`), без копеек и без float |
| Тонны | Число (`5`, `2.5`) |
| Проценты | Число процентов (`10`, `0.5`), не доля |
| Даты | ISO 8601: `"2026-11-14"`, `"2026-11-14T10:00:00+05:00"` |
| Ошибки | HTTP-код + `{"error": {"code": "...", "message": "..."}}`. `code` — для логики фронта, `message` — для показа пользователю |

**Пояснения ИИ отделены от расчётов.** Цифры (залог, допуск, риск) приходят быстро из формул. Текст ИИ — отдельным запросом: модель отвечает несколько секунд, и фронт показывает «ИИ пишет пояснение». В тексте ИИ только цифры, которые уже посчитал бэкенд.

## 2. Общие типы

```ts
type ParticipantRef = {
  id: string            // "stroyplus"
  name: string          // "СтройПлюс"
  city: string          // "Фергана"
  rating: number        // 0–100, целое
}

type Product = {
  code: 'flour' | 'sugar' | 'cement'
  name: string          // локализованное: "Мука высшего сорта"
}

type DepositInfo = {
  pct: number           // 10
  amount: number        // 450000
  tierMinRating: number // 40 — нижняя граница текущего уровня
  next: {               // null, если уровень уже лучший
    pct: number         // 6
    rating: number      // 60 — рейтинг, нужный для следующего уровня
    dealsNeeded: number // 2 — сколько честных сделок до него
  } | null
}

type Explanation = { text: string }   // ответ ИИ, уже на нужном языке

type Reason = {
  code: 'rule_min_rating' | 'rule_newcomer_volume' | 'low_rating' | 'volume_exceeds_lot'
  message: string       // "Продавец не продаёт новичкам больше 5 т"
  ruleText?: string     // цитата правила продавца, если причина в нём
}
```

## 3. Персонажи и справочники

### `GET /api/personas`
Список для переключателя персонажей. Заголовок `X-Participant-Id` не нужен.

```json
[
  { "id": "stroyplus", "name": "СтройПлюс", "kind": "buyer", "city": "Фергана", "rating": 40, "isNewcomer": true,
    "description": "Новичок, сделок пока нет" },
  { "id": "megastroy", "name": "Мегастрой", "kind": "buyer", "city": "Ташкент", "rating": 92, "isNewcomer": false,
    "description": "Надёжный участник, 0 срывов" },
  { "id": "baraka", "name": "Магазин «Барака»", "kind": "buyer", "city": "Фергана", "rating": 42, "isNewcomer": true,
    "description": "Малый бизнес, ищет пул" },
  { "id": "fergana-cement", "name": "Ферганский цементный завод", "kind": "seller", "city": "Фергана", "rating": 88, "isNewcomer": false,
    "description": "Продавец" }
]
```

### `GET /api/deposit-tiers`
Таблица уровней залога из PRD — единственный источник для шкалы на фронте.

```json
[
  { "minRating": 0,  "maxRating": 39,  "pctMin": 15, "pctMax": 15, "label": "Низкий рейтинг (после срывов)" },
  { "minRating": 40, "maxRating": 59,  "pctMin": 10, "pctMax": 10, "label": "Новичок, растущий участник" },
  { "minRating": 60, "maxRating": 79,  "pctMin": 6,  "pctMax": 6,  "label": "Проверенный участник" },
  { "minRating": 80, "maxRating": 89,  "pctMin": 3,  "pctMax": 3,  "label": "Надёжный участник" },
  { "minRating": 90, "maxRating": 100, "pctMin": 0,  "pctMax": 1,  "label": "Самые надёжные" }
]
```

## 4. Лоты и заявка (экран 1)

### `GET /api/lots`
Каталог с допуском **текущего** участника.

```json
[
  {
    "id": "cement-40",
    "product": { "code": "cement", "name": "Цемент М400 в мешках" },
    "seller": { "id": "fergana-cement", "name": "Ферганский цементный завод", "city": "Фергана", "rating": 88 },
    "volumeT": 40,
    "pricePerT": 900000,
    "deliveryUntil": "2026-11-20",
    "myAdmission": { "status": "limited", "maxVolumeT": 5 }
  }
]
```
`myAdmission.status`: `available` (можно весь объём) · `limited` (до `maxVolumeT`) · `unavailable` (нельзя совсем, в `reason` — почему).

### `GET /api/lots/{lotId}`
Тот же объект лота + `rule` (правило продавца, тип см. §6) — или `null`.

### `GET /api/lots/{lotId}/quote?volumeT=8`
Допуск и залог для текущего участника и выбранного объёма. Только формулы, без ИИ.

```json
{
  "volumeT": 8,
  "admitted": false,
  "reason": {
    "code": "rule_newcomer_volume",
    "message": "Продавец не продаёт новичкам больше 5 т",
    "ruleText": "Не продавать новичкам больше 5 т, пускать от рейтинга 40"
  },
  "maxVolumeT": 5,
  "goodsAmount": 7200000,
  "deposit": { "pct": 10, "amount": 720000, "tierMinRating": 40,
               "next": { "pct": 6, "rating": 60, "dealsNeeded": 2 } },
  "comparison": {
    "uzexToday": { "brokerRequired": true, "depositPctMax": 10 },
    "trustedExample": { "rating": 92, "depositPct": 1 }
  }
}
```
Если `admitted: true`, то `reason` = `null`.

### `GET /api/lots/{lotId}/quote/explanation?volumeT=8`
Пояснение ИИ к расчёту выше (почему такой залог или отказ и что сделать) → `Explanation`. Пример: «Ваш залог 10%, так как ваш рейтинг 40. Совершите ещё 2 сделки без срывов — рейтинг поднимется до 60, и залог снизится до 6%».

### `POST /api/lots/{lotId}/bids`
```json
{ "volumeT": 5 }
```
→ `201`
```json
{ "id": "bid-1", "lotId": "cement-40", "volumeT": 5, "deposit": { "pct": 10, "amount": 450000 }, "status": "deposit_held" }
```
Если участник не допущен → `422` с `error.code` из `Reason.code`.

## 5. Пул (экран 2)

### `GET /api/pools/suggestion?product=flour&volumeT=10&city=Фергана&until=2026-11-15`
ИИ-пул под запрос покупателя: подбор, маршрут и деление доставки считает алгоритм (PRD, «Подбор пула»).

```json
{
  "id": "pool-flour-90",
  "lot": { "id": "flour-90", "product": { "code": "flour", "name": "Мука высшего сорта" },
           "seller": { "id": "fergana-mill", "name": "Ферганский мелькомбинат", "city": "Фергана", "rating": 92 },
           "volumeT": 90, "pricePerT": 4732000, "deliveryUntil": "2026-11-14" },
  "status": "forming",
  "collectedT": 80,
  "members": [
    { "participant": { "id": "nur", "name": "Магазин «Нур»", "city": "Маргилан", "rating": 81 },
      "volumeT": 25, "deposit": { "pct": 3, "amount": 3549000 }, "distanceKm": 14, "status": "joined", "isMe": false }
  ],
  "me": { "volumeT": 10, "deposit": { "pct": 10, "amount": 4732000 }, "status": "invited" },
  "route": {
    "warehouse": { "name": "Склад мелькомбината", "lat": 40.389, "lon": 71.783 },
    "stops": [ { "participantId": "nur", "order": 1, "lat": 40.471, "lon": 71.724, "eta": "2026-11-14T09:30:00+05:00" } ],
    "distanceKm": 86
  },
  "economics": {
    "aloneTotal": 52600000,
    "poolTotal": 47367667,
    "savings": 5232333,
    "deliveryTotal": 429000,
    "deliveryShare": 47667,
    "deliveryTariff": { "baseSum": 300000, "perKmSum": 1500 }
  }
}
```
- `members` — другие участники; текущий участник — отдельно в `me`, чтобы фронт не искал его в списке.
- `route.stops` — в порядке развоза. Координаты нужны для схемы маршрута (настоящей карты нет).
- `economics` — для текущего участника: `aloneTotal` — купить одному по рыночной цене со своей машиной; `poolTotal` — товар по оптовой цене + его доля доставки. `deliveryTotal` = 300 000 + 1 500 × `distanceKm`, `deliveryShare` — его доля по тоннам.

### `GET /api/pools/{poolId}/explanation` → `Explanation`
«4 магазина рядом ищут ту же муку: вместе вы покупаете целую машину по оптовой цене и экономите 5,2 млн сум».

### `POST /api/pools/{poolId}/join`
```json
{ "volumeT": 10, "delivery": "truck" }
```
`delivery`: `truck` (привезут по маршруту) · `pickup` (заберу сам, тогда нужен `pickupSlot`: ISO-время). → пул с `me.status: "joined"`. Когда набран объём лота → `status: "contract_formed"` (смарт-контракт в демо — статус).

### `GET /api/pools/{poolId}/timeline`
Сценарий сбора пула для анимации шага «Сбор»: фронт проигрывает события по `atSec`. Данные — с бэкенда, анимация — на фронте.

```json
[
  { "atSec": 0.7, "type": "joined",   "participantId": "baraka", "message": "Вы в пуле" },
  { "atSec": 2.6, "type": "left",     "participantId": "dilshod", "message": "Магазин «Дилшод» отказался" },
  { "atSec": 5.2, "type": "replaced", "participantId": "oydin",  "replacesId": "dilshod",
    "message": "Вместо него — Магазин «Ойдин», 15 т" },
  { "atSec": 7.8, "type": "completed", "message": "Пул собран: 90 из 90 т" }
]
```

### `POST /api/pools/{poolId}/confirm-delivery`
Покупатель подтверждает получение → деньги продавцу, рейтинг пересчитан.
```json
{
  "status": "completed",
  "rating": { "before": 42, "after": 48 },
  "deposit": { "pctBefore": 10, "pctAfter": 10 },
  "message": "Рейтинг вырос до 48. Залог снизится до 6% при рейтинге 60"
}
```

## 6. Продавец (экран 3)

```ts
type SellerRule = {
  minRating: number | null          // 40
  newcomerMaxVolumeT: number | null // 5
}
```
Поля как в примере PRD. Новые поля добавляем по договорённости.

### `GET /api/seller/lots/{lotId}`
Для `X-Participant-Id` продавца этого лота; иначе `403`.

```json
{
  "lot": { "id": "cement-40", "product": { "code": "cement", "name": "Цемент М400 в мешках" }, "volumeT": 40, "pricePerT": 900000, "deliveryUntil": "2026-11-20" },
  "rule": null,
  "riskLevel": "high",
  "applications": [
    { "id": "app-1", "participant": { "id": "stroyplus", "name": "СтройПлюс", "city": "Фергана", "rating": 40 },
      "volumeT": 8, "isNewcomer": true, "status": "pending", "reason": null,
      "risk": { "level": "low", "signals": [] } },
    { "id": "app-3", "participant": { "id": "tradeinvest", "name": "ТрейдИнвест", "city": "Коканд", "rating": 55 },
      "volumeT": 32, "isNewcomer": false, "status": "pending", "reason": null,
      "risk": { "level": "high", "signals": [
        { "code": "volume_concentration", "message": "Покупает 80% объёма лота" },
        { "code": "circular_deals", "message": "Замкнутая цепочка сделок с «Восток Савдо»" } ] } }
  ]
}
```
- `status`: `pending` (правила ещё нет) · `admitted` · `rejected` (в `reason` — почему, с `ruleText`).
- `risk.level`: `low` · `medium` · `high`. Сигналы находят детекторы, не ИИ.

### `POST /api/seller/lots/{lotId}/rules/parse`
ИИ разбирает текст продавца в правило. Правило ещё **не** применяется.
```json
{ "text": "Не продавать новичкам больше 5 т, пускать от рейтинга 40" }
```
→ `200`
```json
{
  "rule": { "minRating": 40, "newcomerMaxVolumeT": 5 },
  "summary": [
    { "label": "Минимальный рейтинг", "value": "40" },
    { "label": "Новичкам — не больше", "value": "5 т" }
  ]
}
```
Модель не уложилась в схему → `422` `{"error": {"code": "rule_parse_failed", "message": "Не удалось разобрать правило. Переформулируйте"}}`.

### `PUT /api/seller/lots/{lotId}/rule`
Продавец подтверждает правило — человек решает. Тело: `SellerRule`. → тот же ответ, что `GET /api/seller/lots/{lotId}`, с пересчитанными `applications` (`admitted` / `rejected`).

### `GET /api/seller/lots/{lotId}/applications/{applicationId}/risk-explanation` → `Explanation`
ИИ формулирует риск по сигналам детекторов: «ТрейдИнвест хочет купить 80% лота и связан замкнутой цепочкой сделок с «Восток Савдо» — похоже на перепродажу».

## 7. Профиль

### `GET /api/participants/me`
```json
{
  "participant": { "id": "baraka", "name": "Магазин «Барака»", "city": "Фергана", "rating": 42 },
  "kind": "buyer",
  "isNewcomer": true,
  "dealsCompleted": 1,
  "deposit": { "pct": 10, "tierMinRating": 40, "next": { "pct": 6, "rating": 60, "dealsNeeded": 2 } },
  "ratingBreakdown": {
    "start": 40,
    "startSource": "base",
    "historyWeight": 0.17,
    "raw": 54,
    "components": [
      { "code": "S", "label": "Успешные сделки",       "value": 1,   "weight": 0.30 },
      { "code": "P", "label": "Платежи вовремя",        "value": 0.5, "weight": 0.25 },
      { "code": "D", "label": "Поставка и забор вовремя", "value": 0.5, "weight": 0.20 },
      { "code": "T", "label": "Время на бирже",         "value": 0.03, "weight": 0.10 },
      { "code": "V", "label": "Разные контрагенты",     "value": 0.1, "weight": 0.15 }
    ],
    "penalties": [],
    "nextDealGain": 3
  },
  "history": [
    { "id": "deal-1", "date": "2026-11-14", "product": { "code": "flour", "name": "Мука высшего сорта" },
      "volumeT": 3, "counterparty": "Ферганский мелькомбинат", "status": "completed", "ratingDelta": 2 }
  ]
}
```
- Рейтинг считается по формуле PRD: `raw = 100·(0.30S + 0.25P + 0.20D + 0.10T + 0.15V)`, `w = n / (n + 5)`, `rating = w·raw + (1 − w)·start`, затем штрафы и ограничение 0–100. В примере: n = 1, raw = 54, rating = 0.17·54 + 0.83·40 ≈ 42.
- `startSource`: `base` (стартовые 40) · `tax_history` (по данным ГНК — заглушка, старт 60) · `parent_company` (рейтинг материнской компании).
- `penalties`: `[{ "code": "failure" | "dispute", "points": -15 | -5, "date": "..." }]`.
- `history[].status`: `completed` · `in_progress` · `failed`.

## 8. Открытые вопросы к бэкенду

1. camelCase в JSON — ок, или нужен snake_case (тогда фронт конвертирует сам)?
2. Персонажи и демо-данные: генерируем на старте из сида в коде или храним в JSON в `data/`?
3. Пояснения ИИ: кэшируем по входным данным, чтобы на питче не ждать модель и не зависеть от сети? Предлагаю кэш + заранее прогретые ответы для демо-сценария.
4. Свободный текст запроса покупателя (`/api/pools/suggestion` сейчас принимает поля) — оставляем поля или добавляем четвёртую задачу LLM? Решает команда (см. PRD, «Интеграция Claude»).
