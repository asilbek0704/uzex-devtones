import { useState, type KeyboardEvent } from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './NumberField.module.scss'

type NumberFieldProps = {
  id: string
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  /** Единица справа от числа: «т» */
  unit?: string
  /** Подписи кнопок для скринридеров */
  decrementLabel: string
  incrementLabel: string
  'aria-describedby'?: string
  className?: string
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

/**
 * Число с кнопками −/+: крупная таблетка под палец и проектор.
 * Ввод с клавиатуры, стрелки ↑/↓ меняют на шаг, значение держится в [min, max].
 */
export function NumberField({
  id,
  value,
  onChange,
  min = 0,
  max = Number.MAX_SAFE_INTEGER,
  step = 1,
  unit,
  decrementLabel,
  incrementLabel,
  'aria-describedby': describedBy,
  className,
}: NumberFieldProps) {
  // Черновик ввода: пока поле в фокусе, можно стереть число целиком
  const [draft, setDraft] = useState<string | null>(null)

  const commit = (next: number) => onChange(clamp(next, min, max))

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      setDraft(null)
      commit(value + (event.key === 'ArrowUp' ? step : -step))
    }
    if (event.key === 'Enter') event.currentTarget.blur()
  }

  return (
    <div className={cn(s.field, className)}>
      <button
        type="button"
        className={s.step}
        aria-label={decrementLabel}
        aria-controls={id}
        disabled={value <= min}
        onClick={() => {
          setDraft(null)
          commit(value - step)
        }}
      >
        <Icon name="minus" size={22} strokeWidth={2.2} />
      </button>

      <span className={s.value}>
        <input
          id={id}
          className={s.input}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          role="spinbutton"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-describedby={describedBy}
          value={draft ?? String(value)}
          size={Math.max(2, (draft ?? String(value)).length)}
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, '').slice(0, 6)
            setDraft(digits)
            if (digits) commit(Number(digits))
          }}
          onBlur={() => setDraft(null)}
          onKeyDown={onKeyDown}
        />
        {unit && <span className={s.unit}>{unit}</span>}
      </span>

      <button
        type="button"
        className={s.step}
        aria-label={incrementLabel}
        aria-controls={id}
        disabled={value >= max}
        onClick={() => {
          setDraft(null)
          commit(value + step)
        }}
      >
        <Icon name="plus" size={22} strokeWidth={2.2} />
      </button>
    </div>
  )
}
