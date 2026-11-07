import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './Menu.module.scss'

export type MenuItem = {
  id: string
  content: ReactNode
}

type MenuProps = {
  /** Содержимое кнопки-триггера */
  trigger: ReactNode
  /** Подпись для скринридеров: «Войти как» */
  label: string
  items: MenuItem[]
  /** id выбранного пункта — отмечается галочкой */
  selectedId?: string
  onSelect: (id: string) => void
  /** К какому краю триггера прижать список */
  align?: 'start' | 'end'
  className?: string
}

/**
 * Выпадающий список с одним выбранным пунктом (role=menu, menuitemradio).
 * Клавиатура: стрелки, Home/End, Escape; клик снаружи закрывает.
 */
export function Menu({
  trigger,
  label,
  items,
  selectedId,
  onSelect,
  align = 'end',
  className,
}: MenuProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()

  // При открытии фокус — на выбранный пункт
  useEffect(() => {
    if (!open) return
    const index = Math.max(
      0,
      items.findIndex((item) => item.id === selectedId),
    )
    itemRefs.current[index]?.focus()
  }, [open, items, selectedId])

  // Клик снаружи закрывает список
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = itemRefs.current.findIndex(
      (el) => el === document.activeElement,
    )
    const last = items.length - 1
    const go = (index: number) => {
      event.preventDefault()
      itemRefs.current[index]?.focus()
    }
    if (event.key === 'ArrowDown') go(current >= last ? 0 : current + 1)
    else if (event.key === 'ArrowUp') go(current <= 0 ? last : current - 1)
    else if (event.key === 'Home') go(0)
    else if (event.key === 'End') go(last)
    else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') setOpen(false)
  }

  return (
    <div ref={rootRef} className={cn(s.root, className)}>
      <button
        ref={triggerRef}
        type="button"
        className={s.trigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            setOpen(true)
          }
        }}
      >
        {trigger}
        <Icon
          name="chevron"
          size={18}
          className={cn(s.chevron, open && s.chevronOpen)}
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className={cn(s.menu, align === 'start' ? s.start : s.end)}
          onKeyDown={onMenuKeyDown}
        >
          {items.map((item, i) => {
            const checked = item.id === selectedId
            return (
              <button
                key={item.id}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                type="button"
                role="menuitemradio"
                aria-checked={checked}
                tabIndex={-1}
                className={s.item}
                onClick={() => {
                  onSelect(item.id)
                  close()
                }}
              >
                <span className={s.content}>{item.content}</span>
                <span className={s.check} aria-hidden="true">
                  {checked && <Icon name="check" size={18} strokeWidth={2.2} />}
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
