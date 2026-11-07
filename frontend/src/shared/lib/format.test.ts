import { describe, expect, it } from 'vitest'
import { formatDate, formatNumber } from './format'

describe('formatNumber', () => {
  it('делит разряды пробелом и в ru, и в uz', () => {
    expect(formatNumber(4_732_000, 'ru').replace(/\s/g, ' ')).toBe('4 732 000')
    expect(formatNumber(4_732_000, 'uz').replace(/\s/g, ' ')).toBe('4 732 000')
  })
})

describe('formatDate', () => {
  it('ru — «20 ноября»', () => {
    expect(formatDate('2026-11-20', 'ru')).toBe('20 ноября')
  })

  it('uz — «20-noyabr», без «M11»', () => {
    expect(formatDate('2026-11-20', 'uz')).toBe('20-noyabr')
    expect(formatDate('2026-01-05', 'uz')).toBe('5-yanvar')
  })
})
