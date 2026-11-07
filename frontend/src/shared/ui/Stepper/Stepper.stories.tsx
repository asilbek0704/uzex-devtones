import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Stepper } from './Stepper'

const STEPS = ['Запрос', 'Пул', 'Доля', 'Сбор', 'Сделка']

const meta = {
  title: 'UI/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: {
    steps: STEPS,
    current: 1,
    onSelect: fn(),
    'aria-label': 'Шаги покупки',
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// Без onSelect шаги не кликабельны
export const ReadOnly: Story = {
  args: { onSelect: undefined },
}

export const Last: Story = {
  args: { current: 4 },
}
