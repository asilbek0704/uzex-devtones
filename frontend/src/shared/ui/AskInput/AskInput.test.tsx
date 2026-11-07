import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { AskInput } from './AskInput'

function Controlled({ onSubmit }: { onSubmit: (v: string) => void }) {
  const [value, setValue] = useState('')
  return (
    <AskInput
      label="Что нужно купить"
      value={value}
      onChange={setValue}
      onSubmit={onSubmit}
      submitLabel="Найти"
    />
  )
}

describe('AskInput', () => {
  it('отправляет запрос по Enter, а Shift+Enter переносит строку', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(<Controlled onSubmit={onSubmit} />)

    const input = screen.getByLabelText('Что нужно купить')
    await user.type(input, 'мука{Shift>}{Enter}{/Shift}3 т')
    expect(onSubmit).not.toHaveBeenCalled()
    expect(input).toHaveValue('мука\n3 т')

    await user.keyboard('{Enter}')
    expect(onSubmit).toHaveBeenCalledWith('мука\n3 т')
  })

  it('отправляет запрос кнопкой', async () => {
    const onSubmit = vi.fn()
    render(<Controlled onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText('Что нужно купить'), 'сахар')
    await userEvent.click(screen.getByRole('button', { name: 'Найти' }))

    expect(onSubmit).toHaveBeenCalledWith('сахар')
  })
})
