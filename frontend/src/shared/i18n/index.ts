import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import ru from './locales/ru.json'
import uz from './locales/uz.json'

export const SUPPORTED_LANGUAGES = ['ru', 'uz', 'en'] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ru: { translation: ru },
      uz: { translation: uz },
      en: { translation: en },
    },
    supportedLngs: SUPPORTED_LANGUAGES,
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
  })

// <html lang> следует за языком интерфейса (озвучка, переносы, шрифты)
i18n.on('languageChanged', (lng) => {
  if (typeof document === 'undefined') return
  document.documentElement.lang = lng
  document.title = i18n.t('app.name')
})

export { i18n }
export { useLanguage } from './useLanguage'
