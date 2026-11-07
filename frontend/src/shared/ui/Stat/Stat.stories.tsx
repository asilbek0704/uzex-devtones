import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card/Card'
import { Stat, StatGroup } from './Stat'

const meta = {
  title: 'UI/Stat',
  component: Stat,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card variant="island">
        <Story />
      </Card>
    ),
  ],
  args: { label: 'Ваш рейтинг', value: 42 },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Changed: Story = {
  args: { delta: '+6', previous: 'было 36', showChange: true, value: 42 },
}

export const Group: Story = {
  render: () => (
    <Card variant="island">
      <StatGroup>
        <Stat
          label="Рейтинг"
          value={42}
          delta="+6"
          previous="было 36"
          showChange
        />
        <Stat label="Залог" value="10%" />
        <Stat label="Доступно" value="5 т" />
      </StatGroup>
    </Card>
  ),
}
