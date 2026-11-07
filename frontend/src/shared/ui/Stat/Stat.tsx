import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './Stat.module.scss'

type StatProps = {
  label: ReactNode
  value: ReactNode
  /** Изменение: «+6», «−2%» */
  delta?: ReactNode
  /** Прежнее значение: «было 42» */
  previous?: ReactNode
  /** Показать delta и previous (плавно появляются) */
  showChange?: boolean
}

/** Крупная цифра на тёмной карточке с изменением «было → стало» */
export function Stat({
  label,
  value,
  delta,
  previous,
  showChange = false,
}: StatProps) {
  return (
    <div className={cn(showChange && s.changed)}>
      <div className={s.label}>{label}</div>
      <div className={s.values}>
        <span className={s.value}>{value}</span>
        {delta && <span className={s.delta}>{delta}</span>}
        {previous && <span className={s.previous}>{previous}</span>}
      </div>
    </div>
  )
}

export function StatGroup({ children }: { children: ReactNode }) {
  return <div className={s.group}>{children}</div>
}
