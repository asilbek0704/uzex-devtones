import type { ReactNode } from 'react'
import { AiBadge } from '../AiBadge/AiBadge'
import { Card } from '../Card/Card'
import { RevealText } from '../RevealText/RevealText'
import s from './AiNote.module.scss'

type AiNoteProps = {
  /** Текст плашки: «ИИ нашёл пул». Без него плашка не показывается */
  badge?: string
  thinking?: boolean
  title: string
  text?: string
  /** Проявлять заголовок и текст по словам */
  reveal?: boolean
  /** Дополнительный контент под текстом (FieldList, Compare…) */
  children?: ReactNode
  className?: string
}

/** Карточка с ответом ИИ: плашка, заголовок, пояснение */
export function AiNote({
  badge,
  thinking,
  title,
  text,
  reveal = false,
  children,
  className,
}: AiNoteProps) {
  return (
    <Card variant="ai" aria-live="polite" className={className}>
      {badge && <AiBadge thinking={thinking}>{badge}</AiBadge>}
      <p className={s.title}>
        {reveal ? <RevealText key={title}>{title}</RevealText> : title}
      </p>
      {text && (
        <p className={s.text}>
          {reveal ? <RevealText key={text}>{text}</RevealText> : text}
        </p>
      )}
      {children}
    </Card>
  )
}
