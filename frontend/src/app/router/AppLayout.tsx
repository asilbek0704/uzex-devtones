import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router'
import { AppHeader } from '@/widgets/app-header'
import s from './AppLayout.module.scss'

/** Каркас приложения: шапка, экран, дисклеймер демо */
export function AppLayout() {
  const { t } = useTranslation()
  return (
    <div className={s.app}>
      <AppHeader />
      <main className={s.main}>
        <Outlet />
      </main>
      <footer className={s.footer}>{t('footer.disclaimer')}</footer>
    </div>
  )
}
