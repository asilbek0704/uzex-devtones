import type { ReactNode } from 'react'
import s from './FieldList.module.scss'

export type FieldItem = { label: ReactNode; value: ReactNode }

/** Пары «ключ — значение» в белых плашках (что ИИ понял из запроса) */
export function FieldList({ items }: { items: FieldItem[] }) {
  return (
    <dl className={s.fields}>
      {items.map((item, i) => (
        <div
          key={i}
          className={s.field}
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
