import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Icon } from '../Icon/Icon'
import s from './LiveStatus.module.scss'

type LiveStatusProps = {
  /** active — идёт процесс, alert — что-то пошло не так, done — завершено */
  status?: 'active' | 'alert' | 'done'
  children: ReactNode
}

/** Чип живого статуса рядом с заголовком: «● Ищем ещё 5 т» */
export function LiveStatus({ status = 'active', children }: LiveStatusProps) {
  return (
    <span
      className={cn(
        s.live,
        status === 'alert' && s.alert,
        status === 'done' && s.done,
      )}
      role="status"
    >
      {status === 'done' ? (
        <Icon name="check" size={18} strokeWidth={2.2} />
      ) : (
        <span className={s.dot} aria-hidden="true" />
      )}
      {children}
    </span>
  )
}
