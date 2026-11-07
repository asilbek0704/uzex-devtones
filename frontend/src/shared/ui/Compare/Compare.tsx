import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './Compare.module.scss'

type CompareCellProps = {
  label: ReactNode
  value: ReactNode
  caption?: ReactNode
  /** Выгодный вариант — зелёная заливка */
  highlighted?: boolean
}

export function CompareCell({
  label,
  value,
  caption,
  highlighted = false,
}: CompareCellProps) {
  return (
    <div className={cn(s.cell, highlighted && s.win)}>
      <div className={s.label}>{label}</div>
      <div className={s.value}>{value}</div>
      {caption && <div className={s.caption}>{caption}</div>}
    </div>
  )
}

/** Сравнение двух вариантов бок о бок: «Одному» vs «В пуле» */
export function Compare({ children }: { children: ReactNode }) {
  return <div className={s.compare}>{children}</div>
}
