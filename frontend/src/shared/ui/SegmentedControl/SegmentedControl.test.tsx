import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const OPTIONS = [
  { value: 2, label: '2 т' },
  { value: 3, label: '3 т' },
  { value: 5, label: '5 т' },
]

function Controlled({ onChange }: { onChange?: (v: number) => void }) {
  const [value, setValue] = useState(3)
  return (
    <SegmentedControl
      aria-label="Сколько тонн"
      options={OPTIONS}
      value={value}
      onChange={(v) => {
        setValue(v)
        onChange?.(v)
      }}
    />
  )
}

describe('SegmentedControl', () => {
  it('отмечает выбранный пункт и делает фокусируемым только его', () => {
    render(<Controlled />)

    const selected = screen.getByRole('radio', { name: '3 т' })
    expect(selected).toBeChecked()
    expect(selected).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('radio', { name: '2 т' })).toHaveAttribute(
      'tabindex',
      '-1',
    )
  })

  it('выбирает пункт по клику', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: '5 т' }))

    expect(onChange).toHaveBeenCalledWith(5)
    expect(screen.getByRole('radio', { name: '5 т' })).toBeChecked()
  })

  it('не вызывает onChange при клике по уже выбранному', async () => {
    const onChange = vi.fn()
    render(<Controlled onChange={onChange} />)

    await userEvent.click(screen.getByRole('radio', { name: '3 т' }))

    expect(onChange).not.toHaveBeenCalled()
  })

  it('переключается стрелками по кругу', async () => {
    const user = userEvent.setup()
    render(<Controlled />)

    screen.getByRole('radio', { name: '3 т' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '5 т' })).toHaveFocus()
    expect(screen.getByRole('radio', { name: '5 т' })).toBeChecked()

    await user.keyboard('{ArrowRight}')
    expect(screen.getByRole('radio', { name: '2 т' })).toBeChecked()

    await user.keyboard('{ArrowLeft}')
    expect(screen.getByRole('radio', { name: '5 т' })).toBeChecked()
  })
})
