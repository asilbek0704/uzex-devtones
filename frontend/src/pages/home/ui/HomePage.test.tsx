import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { HomePage } from './HomePage'

describe('HomePage', () => {
  it('показывает заголовок на русском', () => {
    render(<HomePage />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'UzEx — прототип' }),
    ).toBeInTheDocument()
  })
})
