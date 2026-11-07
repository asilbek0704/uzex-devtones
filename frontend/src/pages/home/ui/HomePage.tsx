import { useTranslation } from 'react-i18next'
import s from './HomePage.module.scss'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <main className={s.page}>
      <h1>{t('home.title')}</h1>
      <p>{t('home.description')}</p>
    </main>
  )
}
