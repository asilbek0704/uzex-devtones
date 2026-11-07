// Только форматирование чисел для показа. Расчетов здесь нет.

export function sum(n: number): string {
  return `${Math.round(n).toLocaleString('ru-RU')} сум`
}

export function mln(n: number): string {
  if (Math.abs(n) < 1_000_000) return `${(Math.round(n / 1000)).toLocaleString('ru-RU')} тыс. сум`
  return `${(Math.round(n / 10_000) / 100).toLocaleString('ru-RU')} млн сум`
}

export function pct(n: number): string {
  return `${n.toLocaleString('ru-RU')}%`
}

export function t(n: number): string {
  return `${n.toLocaleString('ru-RU')} т`
}

export function date(iso: string): string {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number)
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
  return `${d} ${months[m - 1]}${y !== 2026 ? ` ${y}` : ''}`
}

export function deals(n: number): string {
  const m10 = n % 10
  const m100 = n % 100
  const word = m10 === 1 && m100 !== 11 ? 'сделка' : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? 'сделки' : 'сделок'
  return `${n} ${word}`
}
