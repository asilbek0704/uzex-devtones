import { useTranslation } from 'react-i18next'
import { Link, NavLink, matchPath, useLocation } from 'react-router'
import { LanguageSwitcher } from '@/features/switch-language'
import {
  PersonaSwitcher,
  personaHome,
  useCurrentPersona,
  usePersonaPath,
} from '@/features/switch-persona'
import { cn } from '@/shared/lib'
import { Logo } from '@/shared/ui'
import s from './AppHeader.module.scss'

type NavItem = { label: string; to: string; match: string }

/** Шапка: логотип, навигация по роли, язык и «Войти как…» */
export function AppHeader() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const { persona } = useCurrentPersona()
  const personaPath = usePersonaPath()
  const kind = persona?.kind ?? 'buyer'

  const items: NavItem[] =
    kind === 'seller'
      ? [
          {
            label: t('nav.sellerLots'),
            to: personaHome('seller'),
            match: '/seller/*',
          },
          { label: t('nav.profile'), to: '/profile', match: '/profile' },
        ]
      : [
          { label: t('nav.lots'), to: '/lots', match: '/lots/*' },
          { label: t('nav.pool'), to: '/pools/new', match: '/pools/*' },
          { label: t('nav.profile'), to: '/profile', match: '/profile' },
        ]

  return (
    <header className={s.header}>
      <Link to={personaPath(personaHome(kind))} className={s.logo}>
        <Logo>{t('app.name')}</Logo>
      </Link>

      <nav className={s.nav} aria-label={t('header.nav')}>
        <ul className={s.navList}>
          {items.map((item) => {
            const active = Boolean(matchPath(item.match, pathname))
            return (
              <li key={item.match}>
                <NavLink
                  to={personaPath(item.to)}
                  className={cn(s.navItem, active && s.active)}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className={s.tools}>
        <LanguageSwitcher />
        <PersonaSwitcher />
      </div>
    </header>
  )
}
