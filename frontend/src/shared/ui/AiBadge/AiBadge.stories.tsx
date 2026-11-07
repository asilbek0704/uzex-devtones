import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiBadge } from './AiBadge'

const meta = {
  title: 'UI/AiBadge',
  component: AiBadge,
  tags: ['autodocs'],
  args: { children: 'ИИ нашёл пул' },
} satisfies Meta<typeof AiBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Thinking: Story = {
  args: { thinking: true, children: 'ИИ ищет пул' },
}
