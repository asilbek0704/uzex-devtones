import type { CSSProperties } from 'react'
import s from './RevealText.module.scss'

type RevealTextProps = {
  children: string
  /** Задержка между словами, мс */
  step?: number
}

/**
 * Проявляет текст по словам (размытие → резкость). Используется для ответов ИИ.
 * Чтобы проиграть анимацию заново, смените `key` у компонента.
 */
export function RevealText({ children, step = 28 }: RevealTextProps) {
  // split с группой даёт [слово, пробел, слово, …] — слова на чётных позициях
  return (
    <>
      {children.split(/(\s+)/).map((part, i) => {
        if (!part) return null
        if (i % 2 === 1) return part
        const delay = Math.min((i / 2) * step, 560)
        return (
          <span
            key={i}
            className={s.word}
            style={{ '--d': `${delay}ms` } as CSSProperties}
          >
            {part}
          </span>
        )
      })}
    </>
  )
}
