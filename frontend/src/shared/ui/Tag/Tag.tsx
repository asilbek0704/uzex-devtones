import type { ReactNode } from 'react'
import { cn } from '@/shared/lib'
import { Icon, type IconName } from '../Icon/Icon'
import s from './Tag.module.scss'

type TagProps = {
  icon?: IconName
  /** canvas — для бумажных карточек (по умолчанию), paper — для белого холста */
  tone?: 'canvas' | 'paper'
  children: ReactNode
}

/** Статичная метка с иконкой: «Все рядом, до 5 км» */
export function Tag({ icon, tone = 'canvas', children }: TagProps) {
  return (
    <span className={cn(s.tag, tone === 'paper' && s.paper)}>
      {icon && <Icon name={icon} size={16} strokeWidth={2} />}
      {children}
    </span>
  )
}

export function TagGroup({ children }: { children: ReactNode }) {
  return <div className={s.group}>{children}</div>
}
