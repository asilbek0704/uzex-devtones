import type { ReactNode } from 'react'
import { TrustBadge } from '@/shared/ui'
import { trustLevel } from '../model/trust'

type RatingBadgeProps = {
  rating: number
  children?: ReactNode
  className?: string
}

/** Рейтинг доверия участника с цветом уровня по PRD */
export function RatingBadge({ rating, children, className }: RatingBadgeProps) {
  return (
    <TrustBadge score={rating} level={trustLevel(rating)} className={className}>
      {children}
    </TrustBadge>
  )
}
