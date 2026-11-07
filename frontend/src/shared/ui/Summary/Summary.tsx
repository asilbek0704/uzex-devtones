import type { ReactNode } from 'react'
import s from './Summary.module.scss'

type SummaryRow = { label: ReactNode; value: ReactNode }

type SummaryProps = {
  rows: SummaryRow[]
  total: SummaryRow
}

/** Расчёт на тёмной карточке: строки и крупный итог под чертой */
export function Summary({ rows, total }: SummaryProps) {
  return (
    <div className={s.sum}>
      {rows.map((row, i) => (
        <div key={i} className={s.row}>
          <span>{row.label}</span>
          <b>{row.value}</b>
        </div>
      ))}
      <div className={s.total}>
        <span>{total.label}</span>
        <b>{total.value}</b>
      </div>
    </div>
  )
}
