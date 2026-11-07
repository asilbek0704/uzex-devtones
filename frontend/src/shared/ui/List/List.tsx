import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './List.module.scss'

type ListRowProps = {
  title: ReactNode
  meta?: ReactNode
  /** Значение справа: «4 т» */
  value?: ReactNode
  /** Элемент в конце строки (TrustBadge). Скрывается на узких экранах */
  trailing?: ReactNode
  /** Плашка «вы» рядом с названием */
  youLabel?: string
  /** Участник выбыл: серый текст, название зачёркнуто */
  out?: boolean
  /** Проиграть анимацию появления */
  entering?: boolean
}

export function ListRow({
  title,
  meta,
  value,
  trailing,
  youLabel,
  out = false,
  entering = false,
}: ListRowProps) {
  return (
    <div className={cn(s.row, out && s.out, entering && s.enter)}>
      <span className={s.title}>
        <span className={s.name}>{title}</span>
        {youLabel && <span className={s.you}>{youLabel}</span>}
        {meta && <span className={s.meta}>{meta}</span>}
      </span>
      <span className={s.value}>{value}</span>
      {trailing && <span className={s.trailing}>{trailing}</span>}
    </div>
  )
}

/** Список участников / позиций с разделителями */
export function List({ children }: { children: ReactNode }) {
  return <div className={s.rows}>{children}</div>
}
