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
