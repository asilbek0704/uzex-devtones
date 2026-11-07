import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './Timeline.module.scss'

export type TimelineItem = {
  title: ReactNode
  description?: ReactNode
  status: 'done' | 'current' | 'pending'
}

/** Этапы сделки: пройденные — зелёные с галочкой, текущий — с обводкой */
export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className={s.tl}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            s.item,
            item.status === 'done' && s.done,
            item.status === 'current' && s.current,
          )}
          aria-current={item.status === 'current' ? 'step' : undefined}
        >
          <span className={s.circle}>
            {item.status === 'done' ? (
              <Icon name="check" size={18} strokeWidth={2.2} />
            ) : (
              i + 1
            )}
          </span>
          <div>
            <div className={s.title}>{item.title}</div>
            {item.description && (
              <div className={s.description}>{item.description}</div>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}
