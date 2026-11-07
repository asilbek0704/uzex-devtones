// Типы по контракту docs/api-contract.md (§2, §3, §7)

export type ParticipantKind = 'buyer' | 'seller'

export type ParticipantRef = {
  id: string
  name: string
  city: string
  rating: number
}

export type Persona = ParticipantRef & {
  kind: ParticipantKind
  isNewcomer: boolean
  description: string
}

export type DepositNext = {
  pct: number
  rating: number
  dealsNeeded: number
}

export type DepositTier = {
  minRating: number
  maxRating: number
  pctMin: number
  pctMax: number
  label: string
}

/** GET /api/participants/me — поля, нужные сейчас; разбор рейтинга добавится с профилем */
export type Me = {
  participant: ParticipantRef
  kind: ParticipantKind
  isNewcomer: boolean
  dealsCompleted: number
  deposit: {
    pct: number
    tierMinRating: number
    next: DepositNext | null
  }
}
