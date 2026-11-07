import type { Meta, StoryObj } from '@storybook/react-vite'
import { LiveStatus } from './LiveStatus'

const meta = {
  title: 'UI/LiveStatus',
  component: LiveStatus,
  tags: ['autodocs'],
  args: { children: 'Ищем ещё 5 т' },
} satisfies Meta<typeof LiveStatus>

export default meta
type Story = StoryObj<typeof meta>

export const Active: Story = {}

export const Alert: Story = {
  args: { status: 'alert', children: 'Пул не набран' },
}

export const Done: Story = {
  args: { status: 'done', children: 'Пул собран' },
}
