import { useTranslation } from 'react-i18next'
import { useLanguage } from '@/shared/i18n'
import { SegmentedControl } from '@/shared/ui'

const OPTIONS = [
  { value: 'ru' as const, label: 'RU' },
  { value: 'uz' as const, label: 'UZ' },
]

/** Язык интерфейса: русский или узбекский */
export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const lang = useLanguage()

  return (
    <SegmentedControl
      size="sm"
      aria-label={t('header.language')}
      options={OPTIONS}
      value={lang === 'uz' ? 'uz' : 'ru'}
      onChange={(value) => void i18n.changeLanguage(value)}
    />
  )
}
