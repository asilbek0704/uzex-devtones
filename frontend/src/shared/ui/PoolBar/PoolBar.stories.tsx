import type { Meta, StoryObj } from '@storybook/react-vite'
import { PoolBar } from './PoolBar'

const SEGMENTS = [
  { id: 'nur', value: 4, title: 'Магазин «Нур» · 4 т' },
  { id: 'sabr', value: 3, title: 'Магазин «Сабр» · 3 т' },
  { id: 'kamol', value: 3, title: 'Магазин «Камол» · 3 т' },
  { id: 'dilshod', value: 2, title: 'Магазин «Дилшод» · 2 т' },
]

const meta = {
  title: 'UI/PoolBar',
  component: PoolBar,
  tags: ['autodocs'],
  args: {
    segments: SEGMENTS,
    total: 20,
    'aria-label': 'Собрано 12 из 20 т',
  },
} satisfies Meta<typeof PoolBar>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithYou: Story = {
  args: {
    segments: [
      ...SEGMENTS.slice(0, 2),
      { id: 'me', value: 3, variant: 'you', title: 'Вы · 3 т' },
      ...SEGMENTS.slice(2),
    ],
    'aria-label': 'Собрано 15 из 20 т, ваша доля 3 т',
  },
}

export const WithLeaving: Story = {
  args: {
    segments: [
      ...SEGMENTS.slice(0, 2),
      { id: 'dilshod', value: 2, variant: 'leaving', title: 'Выбывает · 2 т' },
    ],
    'aria-label': 'Собрано 9 из 20 т, один участник выбывает',
  },
}

export const Large: Story = {
  args: { size: 'lg' },
}

export const Full: Story = {
  args: { total: 12, 'aria-label': 'Пул собран: 12 из 12 т' },
}

export const Empty: Story = {
  args: { segments: [], 'aria-label': 'Пул пуст' },
}
