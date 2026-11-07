import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RevealText } from './RevealText'

describe('RevealText', () => {
  it('не разрывает число с неразрывным разделителем разрядов', () => {
    const { container } = render(
      <RevealText>{'в обороте 648 000 сум.'}</RevealText>,
    )
    const words = Array.from(container.querySelectorAll('span')).map(
      (word) => word.textContent,
    )
    expect(words).toEqual(['в', 'обороте', '648 000 сум.'])
  })
})
