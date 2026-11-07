import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from '../Card/Card'
import { Summary } from './Summary'

const meta = {
  title: 'UI/Summary',
  component: Summary,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Card variant="island">
        <Story />
      </Card>
    ),
  ],
  args: {
    rows: [
      { label: 'Мука 3 т', value: '600 000 сум' },
      { label: 'Сбор пула', value: '12 000 сум' },
      { label: 'Доставка', value: '36 000 сум' },
    ],
    total: { label: 'Итого', value: '648 000 сум' },
  },
} satisfies Meta<typeof Summary>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutRows: Story = {
  args: { rows: [] },
}
