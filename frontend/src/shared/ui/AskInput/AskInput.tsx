import { useLayoutEffect, useRef, type FormEvent } from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import { VisuallyHidden } from '../VisuallyHidden/VisuallyHidden'
import s from './AskInput.module.scss'

type AskInputProps = {
  value: string
  onChange: (value: string) => void
  /** Enter без Shift или кнопка отправки */
  onSubmit: (value: string) => void
  /** Подпись для скринридеров */
  label: string
  placeholder?: string
  /** Подпись круглой кнопки отправки; без неё кнопка не показывается */
  submitLabel?: string
  className?: string
}

/** Большое поле запроса на естественном языке, растёт по высоте текста */
export function AskInput({
  value,
  onChange,
  onSubmit,
  label,
  placeholder,
  submitLabel,
  className,
}: AskInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    onSubmit(value)
  }

  return (
    <form className={cn(s.ask, className)} onSubmit={submit}>
      <label>
        <VisuallyHidden>{label}</VisuallyHidden>
        <textarea
          ref={ref}
          className={s.input}
          rows={1}
          value={value}
          placeholder={placeholder}
          autoComplete="off"
          enterKeyHint="search"
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) submit(e)
          }}
        />
      </label>
      {submitLabel && (
        <button type="submit" className={s.send} aria-label={submitLabel}>
          <Icon name="arrow" size={22} />
        </button>
      )}
    </form>
  )
}
