import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib'
import s from './PoolBar.module.scss'

export type PoolBarSegment = {
  id: string
  value: number
  /** you — доля текущего пользователя, leaving — участник выбывает */
  variant?: 'default' | 'you' | 'leaving'
  /** Подсказка при наведении */
  title?: string
}

type PoolBarProps = {
  segments: PoolBarSegment[]
  /** Полный объём (например, 20 т). Незанятый остаток рисуется пустым */
  total: number
  size?: 'md' | 'lg'
  /** Текст для скринридеров: «Собрано 12 из 20 т» */
  'aria-label': string
  className?: string
}

/** Фирменная полоса пула: каждый участник — отдельный сегмент по его объёму */
export function PoolBar({
  segments,
  total,
  size = 'md',
  'aria-label': ariaLabel,
  className,
}: PoolBarProps) {
  const used = segments.reduce((sum, seg) => sum + seg.value, 0)
  const free = Math.max(0, total - used)

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={cn(s.bar, size === 'lg' && s.lg, className)}
    >
      {segments.map((seg) => (
        <span
          key={seg.id}
          title={seg.title}
          className={cn(
            s.seg,
            seg.variant === 'you' && s.you,
            seg.variant === 'leaving' && s.leaving,
          )}
          style={{ '--t': seg.value } as CSSProperties}
        />
      ))}
      {free > 0 && (
        <span
          className={cn(s.seg, s.free)}
          style={{ '--t': free } as CSSProperties}
        />
      )}
    </div>
  )
}
