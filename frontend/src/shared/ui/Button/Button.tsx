import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './Button.module.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
  /** Круглая кнопка-стрелка справа от текста */
  withArrow?: boolean
}

export function Button({
  variant = 'primary',
  withArrow = false,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(s.btn, variant === 'ghost' && s.ghost, className)}
      {...rest}
    >
      <span className={s.label}>{children}</span>
      {withArrow && (
        <span className={s.icon}>
          <Icon name="arrow" size={22} />
        </span>
      )}
    </button>
  )
}
