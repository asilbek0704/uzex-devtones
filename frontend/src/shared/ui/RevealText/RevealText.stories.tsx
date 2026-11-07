import type { Meta, StoryObj } from '@storybook/react-vite'
import { RevealText } from './RevealText'

const meta = {
  title: 'UI/RevealText',
  component: RevealText,
  tags: ['autodocs'],
  args: {
    children:
      'Нашли пул из трёх магазинов. Цена за тонну ниже на 6%, доставка 14 ноября.',
  },
} satisfies Meta<typeof RevealText>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SlowStep: Story = {
  args: { step: 120 },
}

export const KeepsNumbersWhole: Story = {
  args: { children: 'Итого к оплате: 648 000 сум за 3 т муки.' },
}
