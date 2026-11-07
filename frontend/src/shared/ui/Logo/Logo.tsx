import s from './Logo.module.scss'

export function Logo({ children }: { children: string }) {
  return (
    <div className={s.logo}>
      <span className={s.mark} aria-hidden="true" />
      <span className={s.text}>{children}</span>
    </div>
  )
}
