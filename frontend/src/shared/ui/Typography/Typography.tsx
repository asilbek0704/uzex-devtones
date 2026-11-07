import type { HTMLAttributes, LabelHTMLAttributes } from 'react'
import { cn } from '@/shared/lib'
import s from './Typography.module.scss'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 }

export function Heading({ level = 1, className, ...rest }: HeadingProps) {
  const Tag = level === 1 ? 'h1' : 'h2'
  return <Tag className={cn(level === 1 ? s.h1 : s.h2, className)} {...rest} />
}

/** Подзаголовок под H1 */
export function Lead({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(s.lead, className)} {...rest} />
}

/** Выделение слова зелёным маркером: «Купите муку <Mark>вместе</Mark>» */
export function Mark({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn(s.mark, className)} {...rest} />
}

/** Подпись над полем или группой */
export function FieldLabel({
  className,
  ...rest
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn(s.label, className)} {...rest} />
}

/** Серая подсказка под полем */
export function Hint({
  className,
  ...rest
}: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn(s.hint, className)} {...rest} />
}
