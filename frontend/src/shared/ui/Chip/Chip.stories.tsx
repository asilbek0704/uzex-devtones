import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Chip } from './Chip'

const meta = {
  title: 'UI/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Мука', onClick: fn() },
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDot: Story = {
  args: { dotColor: 'var(--flour)' },
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Chip dotColor="var(--flour)">Мука</Chip>
      <Chip dotColor="var(--sugar)">Сахар</Chip>
      <Chip dotColor="var(--cement)">Цемент</Chip>
    </div>
  ),
}

export const Disabled: Story = {
  args: { dotColor: 'var(--flour)', disabled: true },
}
