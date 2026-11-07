import { Scale, type ScaleMark } from '@/shared/ui'
import type { DepositTier } from '../model/types'

const tierPct = (tier: DepositTier) =>
  tier.pctMin === tier.pctMax
    ? `${tier.pctMin}%`
    : `${tier.pctMin}–${tier.pctMax}%`

type DepositScaleProps = {
  rating: number
  /** Уровни залога из /deposit-tiers; без них шкала без делений */
  tiers?: DepositTier[]
  /** Рейтинг следующего уровня (deposit.next.rating) — его деление выделено */
  nextRating?: number
  'aria-label': string
}

/** Рейтинг участника на оси 0–100, под делениями — залог каждого уровня */
export function DepositScale({
  rating,
  tiers,
  nextRating,
  'aria-label': ariaLabel,
}: DepositScaleProps) {
  const marks: ScaleMark[] | undefined = tiers?.map((tier) => ({
    at: tier.minRating,
    label: tierPct(tier),
    highlighted: tier.minRating === nextRating,
  }))
  return <Scale position={rating} marks={marks} aria-label={ariaLabel} />
}
