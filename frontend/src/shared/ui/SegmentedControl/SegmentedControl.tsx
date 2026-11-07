import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { cn } from '@/shared/lib'
import { Icon, type IconName } from '../Icon/Icon'
import s from './SegmentedControl.module.scss'

function placeThumb(
  thumb: HTMLElement,
  item: HTMLElement,
  instant: boolean,
): void {
  if (instant) thumb.style.transition = 'none'
  thumb.style.width = `${item.offsetWidth}px`
  thumb.style.transform = `translateX(${item.offsetLeft}px)`
  if (instant) {
    void thumb.offsetWidth // фиксируем позицию до возврата анимации
    thumb.style.transition = ''
  }
}

export type SegmentedOption<T extends string | number> = {
  value: T
  label: ReactNode
  icon?: IconName
}

type SegmentedControlProps<T extends string | number> = {
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  'aria-label': string
  className?: string
}

/** Переключатель-«таблетка» с ползунком (role=radiogroup, стрелки на клавиатуре) */
export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  'aria-label': ariaLabel,
  className,
}: SegmentedControlProps<T>) {
  const rootRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLSpanElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const selectedRef = useRef(0)
  const placedRef = useRef(false)
  const [ready, setReady] = useState(false)

  const selectedIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  )

  // Двигаем ползунок под выбранный пункт. Первый раз — без анимации.
  useLayoutEffect(() => {
    selectedRef.current = selectedIndex
    const thumb = thumbRef.current
    const item = itemRefs.current[selectedIndex]
    if (!thumb || !item) return
    placeThumb(thumb, item, !placedRef.current)
    if (!placedRef.current) {
      placedRef.current = true
      setReady(true)
    }
  }, [selectedIndex])

  // Ширина пунктов меняется (загрузился шрифт, ресайз) — переставляем мгновенно
  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      const thumb = thumbRef.current
      const item = itemRefs.current[selectedRef.current]
      if (thumb && item) placeThumb(thumb, item, true)
    })
    observer.observe(root)
    return () => observer.disconnect()
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const delta =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? -1
          : 0
    if (!delta) return
    event.preventDefault()
    const next = (i + delta + options.length) % options.length
    itemRefs.current[next]?.focus()
    onChange(options[next].value)
  }

  return (
    <div
      ref={rootRef}
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(s.root, ready && s.ready, className)}
    >
      <span ref={thumbRef} className={s.thumb} aria-hidden="true" />
      {options.map((option, i) => {
        const checked = i === selectedIndex
        return (
          <button
            key={String(option.value)}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            className={s.item}
            onClick={() => !checked && onChange(option.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {option.icon && <Icon name={option.icon} />}
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
