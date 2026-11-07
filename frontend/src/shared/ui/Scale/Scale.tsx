import type { CSSProperties } from 'react'
import { cn } from '@/shared/lib'
import s from './Scale.module.scss'

export type ScaleMark = {
  /** Положение деления, 0–100 (% ширины шкалы) */
  at: number
  label: string
  /** Выделить деление: например, следующий порог */
  highlighted?: boolean
}

type ScaleProps = {
  /** Положение метки, 0–100 (% ширины шкалы) */
  position: number
  /** Деления с подписями под шкалой (например, уровни залога по рейтингу) */
  marks?: ScaleMark[]
  startLabel?: string
  endLabel?: string
  /** Текст для скринридеров: «Рейтинг 40 из 100, залог 10%» */
  'aria-label': string
}

const clamp = (value: number) => Math.min(100, Math.max(0, value))

/** Шкала с зелёной меткой на тёмной карточке; деления — по необходимости */
export function Scale({
  position,
  marks,
  startLabel,
  endLabel,
  'aria-label': ariaLabel,
}: ScaleProps) {
  return (
    <div>
      <div
        className={s.scale}
        style={{ '--p': `${clamp(position)}%` } as CSSProperties}
        role="img"
        aria-label={ariaLabel}
      >
        <span className={s.fill} />
        {marks?.map((mark) => (
          <span
            key={mark.at}
            className={cn(s.tick, mark.highlighted && s.tickHighlighted)}
            style={{ left: `${clamp(mark.at)}%` }}
          />
        ))}
        <span className={s.pin} />
      </div>

      {marks && (
        <div className={s.marks} aria-hidden="true">
          {marks.map((mark, i) => (
            <span
              key={mark.at}
              className={cn(s.mark, mark.highlighted && s.markHighlighted)}
              // Последняя подпись прижата к правому краю, чтобы не налезать на соседнюю
              style={
                i === marks.length - 1 && i > 0
                  ? { right: 0 }
                  : { left: `${clamp(mark.at)}%` }
              }
            >
              {mark.label}
            </span>
          ))}
        </div>
      )}

      {(startLabel || endLabel) && (
        <div className={s.ends}>
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      )}
    </div>
  )
}
