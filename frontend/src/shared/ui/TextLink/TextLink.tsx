import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './TextLink.module.scss'

/** Кнопка, оформленная как подчёркнутая ссылка («Показать ещё раз») */
export function TextLink({
  type = 'button',
  className,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={cn(s.link, className)} {...rest} />
}
