import type { Meta, StoryObj } from '@storybook/react-vite'
import { Scale } from './Scale'

const MARKS = [
  { at: 0, label: '0%' },
  { at: 40, label: '10%', highlighted: true },
  { at: 70, label: '20%' },
  { at: 100, label: '30%' },
]

const meta = {
  title: 'UI/Scale',
  component: Scale,
  tags: ['autodocs'],
  args: {
    position: 40,
    marks: MARKS,
    startLabel: 'Новичок',
    endLabel: 'Доверие 100',
    'aria-label': 'Рейтинг 40 из 100, залог 10%',
  },
} satisfies Meta<typeof Scale>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutMarks: Story = {
  args: { marks: undefined, startLabel: undefined, endLabel: undefined },
}

export const Start: Story = {
  args: { position: 0, 'aria-label': 'Рейтинг 0 из 100' },
}

export const End: Story = {
  args: { position: 100, 'aria-label': 'Рейтинг 100 из 100' },
}

export const OnDark: Story = {
  render: (args) => (
    <div
      style={{
        background: 'var(--ink)',
        color: 'var(--canvas)',
        padding: 24,
        borderRadius: 16,
      }}
    >
      <Scale {...args} />
    </div>
  ),
}
