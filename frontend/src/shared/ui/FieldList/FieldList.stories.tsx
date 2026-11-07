import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldList } from './FieldList'

const meta = {
  title: 'UI/FieldList',
  component: FieldList,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Товар', value: 'Мука' },
      { label: 'Объём', value: '3 т' },
      { label: 'Город', value: 'Фергана' },
      { label: 'Срок', value: 'до 15 ноября' },
    ],
  },
} satisfies Meta<typeof FieldList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Single: Story = {
  args: { items: [{ label: 'Товар', value: 'Мука' }] },
}

export const LongValues: Story = {
  args: {
    items: [
      {
        label: 'Адрес доставки',
        value: 'Фергана, ул. Мустақиллик, 12, склад 3',
      },
      { label: 'Условия', value: 'Привезут машиной по маршруту 14 ноября' },
    ],
  },
}
