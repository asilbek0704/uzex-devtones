import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './Card'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  args: { children: 'Светлая карточка для обычного содержимого' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Paper: Story = {
  args: { variant: 'paper' },
}

export const Island: Story = {
  args: {
    variant: 'island',
    children: 'Тёмная карточка для денег и итогов: 648 000 сум',
  },
}

export const Ai: Story = {
  args: {
    variant: 'ai',
    children: 'Светлая карточка с зелёной полосой для ответов ИИ',
  },
}
