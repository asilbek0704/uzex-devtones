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
  /** Проявлять текст ИИ по словам */
  reveal?: boolean
  /**
   * Проявлять и заголовок (по умолчанию — как reveal). Выключайте, когда
   * заголовок — не слова модели, а факт от бэкенда (например, причина отказа).
   */
  revealTitle?: boolean
  /**
   * Текст ИИ ещё пишется: вместо него — строки-заглушки той же высоты,
   * чтобы карточка и всё под ней не прыгали, когда текст придёт
   */
  textPending?: boolean
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
  revealTitle = reveal,
  textPending = false,
  children,
  className,
}: AiNoteProps) {
  return (
    <Card variant="ai" aria-live="polite" className={className}>
      {badge && <AiBadge thinking={thinking}>{badge}</AiBadge>}
      <p className={s.title}>
        {revealTitle ? <RevealText key={title}>{title}</RevealText> : title}
      </p>
      {textPending ? (
        <span className={s.pending} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : (
        text && (
          <p className={s.text}>
            {reveal ? <RevealText key={text}>{text}</RevealText> : text}
          </p>
        )
      )}
      {children}
    </Card>
  )
}
