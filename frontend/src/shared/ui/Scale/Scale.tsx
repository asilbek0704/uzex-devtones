import type { CSSProperties } from 'react'
import s from './Scale.module.scss'

type ScaleProps = {
  /** Положение метки, 0–100 (% ширины шкалы) */
  position: number
  startLabel?: string
  endLabel?: string
  /** Текст для скринридеров: «Залог 8% из возможных 15%» */
  'aria-label': string
}

/** Шкала с зелёной меткой на тёмной карточке (например, уровень залога) */
export function Scale({
  position,
  startLabel,
  endLabel,
  'aria-label': ariaLabel,
}: ScaleProps) {
  const p = Math.min(100, Math.max(0, position))
  return (
    <div>
      <div
        className={s.scale}
        style={{ '--p': `${p}%` } as CSSProperties}
        role="img"
        aria-label={ariaLabel}
      >
        <span className={s.fill} />
        <span className={s.pin} />
      </div>
      {(startLabel || endLabel) && (
        <div className={s.ends}>
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  )
}
