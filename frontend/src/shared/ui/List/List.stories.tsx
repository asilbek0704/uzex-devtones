import type { Meta, StoryObj } from '@storybook/react-vite'
import { TrustBadge } from '../TrustBadge/TrustBadge'
import { List, ListRow } from './List'

const meta = {
  title: 'UI/List',
  component: List,
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <ListRow
          title="Магазин «Нур»"
          meta="Ташкент"
          value="4 т"
          trailing={<TrustBadge score={82} level="high" />}
        />
        <ListRow
          title="Магазин «Сабр»"
          meta="Фергана"
          value="3 т"
          trailing={<TrustBadge score={61} level="mid" />}
        />
        <ListRow
          title="Вы"
          youLabel="вы"
          meta="Фергана"
          value="3 т"
          trailing={<TrustBadge score={42} level="low" />}
        />
      </>
    ),
  },
} satisfies Meta<typeof List>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OutAndEntering: Story = {
  args: {
    children: (
      <>
        <ListRow title="Магазин «Камол»" meta="Самарканд" value="3 т" />
        <ListRow
          title="Магазин «Дилшод»"
          meta="выбыл из пула"
          value="2 т"
          out
        />
        <ListRow title="Новый участник" value="2 т" entering />
      </>
    ),
  },
}
