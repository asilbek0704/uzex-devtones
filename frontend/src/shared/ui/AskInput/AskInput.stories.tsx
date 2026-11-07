import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { AskInput } from './AskInput'

// AskInput контролируемый: стартовое значение из args, дальше держим его в состоянии
function Controlled(
  props: Omit<React.ComponentProps<typeof AskInput>, 'onChange'>,
) {
  const [value, setValue] = useState(props.value)
  return <AskInput {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'UI/AskInput',
  component: AskInput,
  tags: ['autodocs'],
  render: (args) => <Controlled {...args} />,
  args: {
    label: 'Что нужно купить',
    placeholder: 'Например: 3 т муки в Фергану до 15 ноября',
    submitLabel: 'Найти',
    value: '',
    onSubmit: fn(),
    onChange: fn(),
  },
} satisfies Meta<typeof AskInput>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {}

export const Filled: Story = {
  args: { value: 'Нужно 3 т муки в Фергану до 15 ноября' },
}

export const Multiline: Story = {
  args: { value: 'Мука 3 т\nСахар 500 кг\nДоставка в Фергану' },
}

export const WithoutSubmit: Story = {
  args: { submitLabel: undefined },
}
