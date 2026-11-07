// Типы по контракту docs/api-contract.md (§2, §4)
import type { ParticipantRef } from '@/entities/participant'

export type ProductCode = 'flour' | 'sugar' | 'cement'

export type Product = {
  code: ProductCode
  name: string
}

export type ReasonCode =
  | 'rule_min_rating'
  | 'rule_newcomer_volume'
  | 'low_rating'
  | 'volume_exceeds_lot'

export type Reason = {
  code: ReasonCode
  message: string
  ruleText?: string
}

export type MyAdmission =
  | { status: 'available' }
  | { status: 'limited'; maxVolumeT: number; reason: Reason }
  | { status: 'unavailable'; reason: Reason }

export type Lot = {
  id: string
  product: Product
  seller: ParticipantRef
  volumeT: number
  pricePerT: number
  deliveryUntil: string
  myAdmission: MyAdmission
}

/** Правило продавца (§6 контракта) */
export type SellerRule = {
  minRating: number | null
  newcomerMaxVolumeT: number | null
}

/** GET /api/lots/{lotId} */
export type LotDetails = Lot & { rule: SellerRule | null }

/** GET /api/lots/{lotId}/quote?volumeT= — только формулы, без ИИ */
export type Quote = {
  volumeT: number
  admitted: boolean
  reason: Reason | null
  maxVolumeT: number | null
  goodsAmount: number
  deposit: {
    pct: number
    amount: number
    tierMinRating: number
    next: { pct: number; rating: number; dealsNeeded: number } | null
  }
  comparison: {
    uzexToday: { brokerRequired: boolean; depositPctMax: number }
    trustedExample: { rating: number; depositPct: number }
  }
}

/** POST /api/lots/{lotId}/bids → 201 */
export type Bid = {
  id: string
  lotId: string
  volumeT: number
  deposit: { pct: number; amount: number }
  status: 'deposit_held'
}
