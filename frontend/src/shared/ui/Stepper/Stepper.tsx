import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './Stepper.module.scss'

type StepperProps = {
  steps: string[]
  /** Индекс текущего шага, с 0 */
  current: number
  /** Без обработчика шаги не кликабельны */
  onSelect?: (index: number) => void
  'aria-label': string
}

/** Шаги сценария в шапке: пройденные — с галочкой, текущий — подсвечен */
export function Stepper({
  steps,
  current,
  onSelect,
  'aria-label': ariaLabel,
}: StepperProps) {
  return (
    <nav aria-label={ariaLabel}>
      <ol className={s.steps}>
        {steps.map((name, i) => {
          const done = i < current
          const isCurrent = i === current
          return (
            <li key={name}>
              <button
                type="button"
                className={cn(s.step, done && s.done)}
                aria-current={isCurrent ? 'step' : undefined}
                disabled={!onSelect}
                onClick={() => onSelect?.(i)}
              >
                <span className={s.number}>
                  {done ? (
                    <Icon name="check" size={14} strokeWidth={2.2} />
                  ) : (
                    i + 1
                  )}
                </span>
                <span className={s.label}>{name}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
