import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './TrustBadge.module.scss'

export type TrustLevel = 'high' | 'mid' | 'low'

type TrustBadgeProps = {
  score: number
  /**
   * Цвет плашки. Какой рейтинг считать high/mid/low — бизнес-правило,
   * его решает слой entities (см. PRD), а не этот компонент.
   */
  level: TrustLevel
  /** Подпись справа от числа */
  children?: ReactNode
  className?: string
}

/** Рейтинг доверия: число в цветной «таблетке» */
export function TrustBadge({
  score,
  level,
  children,
  className,
}: TrustBadgeProps) {
  return (
    <span className={cn(s.trust, s[level], className)} title="Рейтинг доверия">
      <span className={s.score}>{score}</span>
      {children}
    </span>
  )
}
