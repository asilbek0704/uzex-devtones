import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { SegmentedControl } from './SegmentedControl'

// Контролируемый переключатель: выбор держим в состоянии истории
function Controlled<T extends string | number>(
  props: Omit<
    React.ComponentProps<typeof SegmentedControl<T>>,
    'value' | 'onChange'
  > & { initial: T },
) {
  const [value, setValue] = useState<T>(props.initial)
  return <SegmentedControl {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'UI/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  render: (args) => <Controlled {...args} initial={args.value} />,
  args: {
    'aria-label': 'Сколько тонн',
    value: 3,
    options: [
      { value: 2, label: '2 т' },
      { value: 3, label: '3 т' },
      { value: 5, label: '5 т' },
    ],
    onChange: () => {},
  },
} satisfies Meta<typeof SegmentedControl<string | number>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Small: Story = {
  args: {
    size: 'sm',
    'aria-label': 'Язык интерфейса',
    value: 'ru',
    options: [
      { value: 'ru', label: 'RU' },
      { value: 'uz', label: 'UZ' },
    ],
  },
}

export const WithIcons: Story = {
  args: {
    'aria-label': 'Как получите',
    value: 'truck',
    options: [
      { value: 'truck', label: 'Привезут', icon: 'truck' },
      { value: 'self', label: 'Заберу сам', icon: 'box' },
    ],
  },
}

export const Strings: Story = {
  args: {
    'aria-label': 'Период',
    value: 'week',
    options: [
      { value: 'day', label: 'День' },
      { value: 'week', label: 'Неделя' },
      { value: 'month', label: 'Месяц' },
    ],
  },
}
