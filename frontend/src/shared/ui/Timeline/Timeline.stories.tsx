import type { Meta, StoryObj } from '@storybook/react-vite'
import { Timeline } from './Timeline'

const meta = {
  title: 'UI/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  args: {
    items: [
      {
        title: 'Заявка принята',
        description: '12 ноября, 10:14',
        status: 'done',
      },
      { title: 'Пул собран', description: 'Ждём ещё 2 т', status: 'current' },
      { title: 'Доставка', description: '14 ноября', status: 'pending' },
    ],
  },
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllDone: Story = {
  args: {
    items: [
      {
        title: 'Заявка принята',
        description: '12 ноября, 10:14',
        status: 'done',
      },
      { title: 'Пул собран', description: '13 ноября, 09:00', status: 'done' },
      { title: 'Сделка подтверждена', status: 'done' },
    ],
  },
}

export const WithoutDescriptions: Story = {
  args: {
    items: [
      { title: 'Заявка принята', status: 'done' },
      { title: 'Пул собран', status: 'current' },
      { title: 'Доставка', status: 'pending' },
    ],
  },
}
