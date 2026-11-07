import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from './Icon'

const NAMES = [
  'arrow',
  'check',
  'chevron',
  'plus',
  'minus',
  'truck',
  'box',
  'pin',
  'calendar',
  'grain',
] satisfies IconName[]

const meta = {
  title: 'UI/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: { name: 'arrow', size: 20 },
} satisfies Meta<typeof Icon>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
      <Icon name="arrow" size={16} />
      <Icon name="arrow" size={20} />
      <Icon name="arrow" size={24} />
      <Icon name="arrow" size={32} strokeWidth={1.5} />
    </div>
  ),
}

export const AllIcons: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))',
        gap: 16,
      }}
    >
      {NAMES.map((name) => (
        <div
          key={name}
          style={{ display: 'grid', justifyItems: 'center', gap: 6 }}
        >
          <Icon name={name} size={24} />
          <code>{name}</code>
        </div>
      ))}
    </div>
  ),
}
