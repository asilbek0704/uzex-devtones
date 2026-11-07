import type { Meta, StoryObj } from '@storybook/react-vite'
import { StatusLabel } from './StatusLabel'

const meta = {
  title: 'UI/StatusLabel',
  component: StatusLabel,
  tags: ['autodocs'],
  args: { tone: 'positive', children: 'Можно весь объём' },
} satisfies Meta<typeof StatusLabel>

export default meta
type Story = StoryObj<typeof meta>

export const Positive: Story = {}

export const Warning: Story = {
  args: { tone: 'warning', children: 'Вам — до 5 т' },
}

export const Negative: Story = {
  args: { tone: 'negative', children: 'Нельзя в этом пуле' },
}

export const Neutral: Story = {
  args: { tone: 'neutral', children: 'Без оценки' },
}

export const AllTones: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <StatusLabel tone="positive">Можно весь объём</StatusLabel>
      <StatusLabel tone="warning">Вам — до 5 т</StatusLabel>
      <StatusLabel tone="negative">Нельзя в этом пуле</StatusLabel>
      <StatusLabel tone="neutral">Без оценки</StatusLabel>
    </div>
  ),
}
