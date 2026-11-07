import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './Chip.module.scss'

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Цвет точки слева, например 'var(--flour)' */
  dotColor?: string
}

/** Кликабельный чип-пример под полем запроса */
export function Chip({
  dotColor,
  type = 'button',
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <button type={type} className={cn(s.chip, className)} {...rest}>
      {dotColor && (
        <span
          className={s.dot}
          style={{ background: dotColor }}
          aria-hidden="true"
        />
      )}
      {children}
    </button>
  )
}
