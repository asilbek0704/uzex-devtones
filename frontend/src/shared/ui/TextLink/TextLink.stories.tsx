import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { TextLink } from './TextLink'

const meta = {
  title: 'UI/TextLink',
  component: TextLink,
  tags: ['autodocs'],
  args: { children: 'Показать сбор пула ещё раз', onClick: fn() },
} satisfies Meta<typeof TextLink>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = {
  args: { disabled: true },
}

export const InText: Story = {
  render: (args) => (
    <p>
      Сбор пула пока не списан. <TextLink {...args} />
    </p>
  ),
}
