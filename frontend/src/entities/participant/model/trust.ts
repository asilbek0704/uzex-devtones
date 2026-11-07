import type { TrustLevel } from '@/shared/ui'

/**
 * Цвет рейтинга по уровням PRD: 0–39 — низкий (после срывов),
 * 40–79 — новичок и растущий участник, 80+ — надёжный.
 */
export function trustLevel(rating: number): TrustLevel {
  if (rating >= 80) return 'high'
  if (rating >= 40) return 'mid'
  return 'low'
}
