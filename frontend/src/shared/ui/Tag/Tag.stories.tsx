import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card/Card'
import { Tag, TagGroup } from './Tag'

const meta = {
  title: 'UI/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: { children: 'Все рядом, до 5 км' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Canvas: Story = {}

export const Paper: Story = {
  args: { tone: 'paper' },
}

export const WithIcon: Story = {
  args: { icon: 'pin' },
}

export const Group: Story = {
  render: () => (
    <Card variant="paper">
      <TagGroup>
        <Tag icon="pin">Все рядом, до 5 км</Tag>
        <Tag icon="calendar">Доставка 14 ноября</Tag>
        <Tag icon="grain">Мука, 3 т</Tag>
      </TagGroup>
    </Card>
  ),
}
