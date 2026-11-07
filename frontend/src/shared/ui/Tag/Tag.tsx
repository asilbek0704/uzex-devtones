import type { ReactNode } from 'react'
import { Icon, type IconName } from '../Icon/Icon'
import s from './Tag.module.scss'

type TagProps = {
  icon?: IconName
  children: ReactNode
}

/** Статичная метка с иконкой: «Все рядом, до 5 км» */
export function Tag({ icon, children }: TagProps) {
  return (
    <span className={s.tag}>
      {icon && <Icon name={icon} size={16} strokeWidth={2} />}
      {children}
    </span>
  )
}

export function TagGroup({ children }: { children: ReactNode }) {
  return <div className={s.group}>{children}</div>
}
