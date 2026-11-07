import type { Meta, StoryObj } from '@storybook/react-vite'
import { Compare, CompareCell } from './Compare'

const meta = {
  title: 'UI/Compare',
  component: Compare,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <CompareCell label="Одному" value="1,2 млн сум" />
        <CompareCell
          label="В пуле"
          value="1,1 млн сум"
          caption="Экономия 100 тыс."
          highlighted
        />
      </>
    ),
  },
} satisfies Meta<typeof Compare>

export default meta
type Story = StoryObj<typeof meta>

export const SideBySide: Story = {}

export const Stacked: Story = {
  args: { stacked: true },
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Compare {...args} />
    </div>
  ),
}

export const Cell: StoryObj<typeof CompareCell> = {
  render: (args) => (
    <div style={{ maxWidth: 320 }}>
      <Compare>
        <CompareCell {...args} />
        <CompareCell label="Один вариант" value="—" />
      </Compare>
    </div>
  ),
  args: { label: 'В пуле', value: '1,1 млн сум', highlighted: true },
}
