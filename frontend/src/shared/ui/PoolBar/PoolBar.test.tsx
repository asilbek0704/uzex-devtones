import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PoolBar } from './PoolBar'

describe('PoolBar', () => {
  it('добавляет пустой сегмент на незанятый остаток', () => {
    render(
      <PoolBar
        aria-label="Собрано 12 из 20 т"
        total={20}
        segments={[
          { id: 'a', value: 4 },
          { id: 'b', value: 8 },
        ]}
      />,
    )

    const bar = screen.getByRole('img', { name: 'Собрано 12 из 20 т' })
    const segments = [...bar.children] as HTMLElement[]
    expect(segments).toHaveLength(3)
    expect(segments[2].style.getPropertyValue('--t')).toBe('8')
  })

  it('не рисует остаток, когда пул собран', () => {
    render(
      <PoolBar
        aria-label="Собрано 20 из 20 т"
        total={20}
        segments={[{ id: 'a', value: 20 }]}
      />,
    )

    expect(screen.getByRole('img').children).toHaveLength(1)
  })
})
