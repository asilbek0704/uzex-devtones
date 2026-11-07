import { describe, expect, it } from 'vitest'
import { trustLevel } from './trust'

describe('trustLevel', () => {
  it.each([
    [0, 'low'],
    [39, 'low'],
    [40, 'mid'],
    [79, 'mid'],
    [80, 'high'],
    [100, 'high'],
  ] as const)('рейтинг %i → %s', (rating, level) => {
    expect(trustLevel(rating)).toBe(level)
  })
})
