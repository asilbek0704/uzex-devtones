import type { Meta, StoryObj } from '@storybook/react-vite'
import { AiNote } from './AiNote'
import { Compare, CompareCell } from '../Compare/Compare'
import { FieldList } from '../FieldList/FieldList'

const meta = {
  title: 'UI/AiNote',
  component: AiNote,
  tags: ['autodocs'],
  args: {
    badge: 'ИИ нашёл пул',
    title: 'Пул из 3 магазинов рядом с вами',
    text: 'Вместе вы получите скидку 6% и доставку в один день.',
  },
} satisfies Meta<typeof AiNote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutBadge: Story = {
  args: { badge: undefined },
}

export const Thinking: Story = {
  args: {
    badge: 'ИИ думает',
    thinking: true,
    title: 'Подбираем пул',
    text: undefined,
    textPending: true,
  },
}

export const TextPending: Story = {
  args: { textPending: true, text: undefined },
}

export const Revealed: Story = {
  args: { reveal: true },
}

export const WithChildren: Story = {
  args: {
    children: (
      <>
        <FieldList
          items={[
            { label: 'Товар', value: 'Мука' },
            { label: 'Объём', value: '3 т' },
            { label: 'Город', value: 'Фергана' },
          ]}
        />
        <Compare>
          <CompareCell label="Одному" value="1,2 млн сум" />
          <CompareCell
            label="В пуле"
            value="1,1 млн сум"
            caption="Экономия 100 тыс."
            highlighted
          />
        </Compare>
      </>
    ),
  },
}
