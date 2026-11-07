// Числа и даты для интерфейса. Валюта и единицы — через i18n в местах использования.

type Lang = 'ru' | 'uz' | 'en'

// Разряды через пробел, как принято и в России, и в Узбекистане.
// Для uz не полагаемся на Intl: в браузерах неполные данные (запятые вместо пробелов).
const numberFormat = new Intl.NumberFormat('ru-RU')

/** 4500000 → «4 500 000» (неразрывные пробелы) */
export function formatNumber(value: number, lang: Lang = 'ru'): string {
  return lang === 'en'
    ? new Intl.NumberFormat('en-GB').format(value)
    : numberFormat.format(value)
}

// Chrome для uz отдаёт «M11» вместо названия месяца — держим свои названия
const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]

/** «2026-11-20» → «20 ноября» / «20-noyabr» */
export function formatDate(iso: string, lang: Lang = 'ru'): string {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00`)
  if (lang === 'uz') return `${date.getDate()}-${UZ_MONTHS[date.getMonth()]}`
  return new Intl.DateTimeFormat(lang === 'en' ? 'en-GB' : 'ru-RU', {
    day: 'numeric',
    month: 'long',
  }).format(date)
}
