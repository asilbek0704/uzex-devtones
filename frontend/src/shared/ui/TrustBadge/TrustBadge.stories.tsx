import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrustBadge } from './TrustBadge'

const meta = {
  title: 'UI/TrustBadge',
  component: TrustBadge,
  tags: ['autodocs'],
  args: { score: 42, level: 'low' },
} satisfies Meta<typeof TrustBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Low: Story = {}

export const Mid: Story = {
  args: { score: 61, level: 'mid' },
}

export const High: Story = {
  args: { score: 82, level: 'high' },
}

export const WithLabel: Story = {
  args: { score: 82, level: 'high', children: 'доверие' },
}

export const AllLevels: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8 }}>
      <TrustBadge score={42} level="low" />
      <TrustBadge score={61} level="mid" />
      <TrustBadge score={82} level="high" />
    </div>
  ),
}
