import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { NumberField } from './NumberField'

// NumberField контролируемый: значение держим в состоянии истории
function Controlled(
  props: Omit<
    React.ComponentProps<typeof NumberField>,
    'value' | 'onChange'
  > & { initial: number },
) {
  const [value, setValue] = useState(props.initial)
  return <NumberField {...props} value={value} onChange={setValue} />
}

const meta = {
  title: 'UI/NumberField',
  component: NumberField,
  tags: ['autodocs'],
  render: (args) => <Controlled {...args} initial={args.value} />,
  args: {
    id: 'share',
    value: 3,
    unit: 'т',
    decrementLabel: 'Меньше',
    incrementLabel: 'Больше',
    onChange: () => {},
  },
} satisfies Meta<typeof NumberField>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutUnit: Story = {
  args: { unit: undefined, value: 500 },
}

export const WithLimits: Story = {
  args: { min: 1, max: 10, value: 3 },
}

export const AtMinimum: Story = {
  args: { min: 1, max: 10, value: 1 },
}

export const AtMaximum: Story = {
  args: { min: 1, max: 10, value: 10 },
}

export const Step: Story = {
  args: { step: 0.5, value: 2 },
}
