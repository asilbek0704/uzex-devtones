import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { NumberField } from './NumberField'

function Controlled() {
  const [value, setValue] = useState(5)
  return (
    <NumberField
      id="n"
      value={value}
      onChange={setValue}
      min={1}
      max={10}
      unit="т"
      decrementLabel="Меньше"
      incrementLabel="Больше"
    />
  )
}

describe('NumberField', () => {
  it('меняет значение кнопками и стрелками', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const input = screen.getByRole('spinbutton')

    await user.click(screen.getByRole('button', { name: 'Больше' }))
    expect(input).toHaveValue('6')

    input.focus()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(input).toHaveValue('4')
  })

  it('держит значение в пределах и блокирует кнопку у границы', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const input = screen.getByRole('spinbutton')

    await user.tripleClick(input)
    await user.keyboard('25')
    await user.tab()
    expect(input).toHaveValue('10')
    expect(screen.getByRole('button', { name: 'Больше' })).toBeDisabled()
  })

  it('позволяет стереть число и ввести новое', async () => {
    const user = userEvent.setup()
    render(<Controlled />)
    const input = screen.getByRole('spinbutton')

    await user.clear(input)
    expect(input).toHaveValue('')
    await user.keyboard('3')
    await user.tab()
    expect(input).toHaveValue('3')
  })
})
