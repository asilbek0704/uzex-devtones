import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import s from './AiBadge.module.scss'

type AiBadgeProps = {
  children: ReactNode
  /** Пульсирующая точка — ИИ сейчас думает */
  thinking?: boolean
}

/** Тёмная плашка «● ИИ нашёл пул» */
export function AiBadge({ children, thinking = false }: AiBadgeProps) {
  return (
    <span className={cn(s.badge, thinking && s.thinking)}>
      <span className={s.dot} aria-hidden="true" />
      {children}
    </span>
  )
}
