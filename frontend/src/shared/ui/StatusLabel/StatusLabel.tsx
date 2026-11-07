import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './StatusLabel.module.scss'

export type StatusTone = 'positive' | 'warning' | 'negative' | 'neutral'

type StatusLabelProps = {
  /**
   * positive — в пользу участника (зелёная точка), warning — ограничение,
   * negative — нельзя, neutral — без оценки
   */
  tone: StatusTone
  children: ReactNode
  className?: string
}

/** Короткий статус с цветной точкой: «Можно весь объём», «Вам — до 5 т» */
export function StatusLabel({ tone, children, className }: StatusLabelProps) {
  return (
    <span className={cn(s.label, s[tone], className)}>
      <span className={s.dot} aria-hidden="true" />
      {children}
    </span>
  )
}
