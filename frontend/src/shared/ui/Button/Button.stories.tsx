import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button, ButtonLink } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Присоединиться к пулу', onClick: fn() },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}

export const PrimaryWithArrow: Story = {
  args: { withArrow: true },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Назад' },
}

export const GhostWithArrow: Story = {
  args: { variant: 'ghost', withArrow: true, children: 'Далее' },
}

export const Disabled: Story = {
  args: { withArrow: true, disabled: true, children: 'К сделке' },
}

// Та же кнопка, но ссылка для переходов между экранами
export const AsLink: StoryObj<typeof ButtonLink> = {
  render: (args) => <ButtonLink {...args} />,
  args: { to: '/ui-kit', withArrow: true, children: 'Ссылка как кнопка' },
}
