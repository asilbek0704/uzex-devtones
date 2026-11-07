import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'
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

type ButtonLinkProps = LinkProps & {
  variant?: 'primary' | 'ghost'
  withArrow?: boolean
  children: ReactNode
}

/** Ссылка, которая выглядит как Button: для переходов между экранами */
export function ButtonLink({
  variant = 'primary',
  withArrow = false,
  className,
  children,
  ...rest
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(s.btn, s.link, variant === 'ghost' && s.ghost, className)}
      {...rest}
    >
      <span className={s.label}>{children}</span>
      {withArrow && (
        <span className={s.icon}>
          <Icon name="arrow" size={22} />
        </span>
      )}
    </Link>
  )
}
