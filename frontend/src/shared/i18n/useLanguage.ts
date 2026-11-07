import { useTranslation } from 'react-i18next'
import type { Language } from './index'

/** Текущий язык интерфейса; используется в ключах запросов и фикстурах */
export function useLanguage(): Language {
  const { i18n } = useTranslation()
  const lang = i18n.resolvedLanguage
  return lang === 'uz' || lang === 'en' ? lang : 'ru'
}
