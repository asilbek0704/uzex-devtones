import type { HTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './Card.module.scss'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * paper — светлая карточка по умолчанию;
   * island — тёмная, для денег и итогов;
   * ai — светлая с зелёной полосой сверху, для ответов ИИ
   */
  variant?: 'paper' | 'island' | 'ai'
}

export function Card({ variant = 'paper', className, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        s.card,
        variant === 'island' && s.island,
        variant === 'ai' && s.ai,
        className,
      )}
      {...rest}
    />
  )
}
