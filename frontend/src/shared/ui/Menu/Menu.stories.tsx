import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { fn } from 'storybook/test'
import { Menu } from './Menu'

const ITEMS = [
  { id: 'stroyplus', content: 'ООО «Стройплюс»' },
  { id: 'nur', content: 'Магазин «Нур»' },
  { id: 'sabr', content: 'Магазин «Сабр»' },
]

// Menu с одним выбранным пунктом: держим выбор в состоянии
function Controlled(props: {
  initial: string
  onSelect: (id: string) => void
}) {
  const [selected, setSelected] = useState(props.initial)
  return (
    <Menu
      trigger={ITEMS.find((item) => item.id === selected)?.content}
      label="Войти как"
      items={ITEMS}
      selectedId={selected}
      onSelect={(id) => {
        setSelected(id)
        props.onSelect(id)
      }}
    />
  )
}

const meta = {
  title: 'UI/Menu',
  component: Menu,
  tags: ['autodocs'],
  render: () => <Controlled initial="stroyplus" onSelect={fn()} />,
  args: {
    trigger: 'ООО «Стройплюс»',
    label: 'Войти как',
    items: ITEMS,
    onSelect: fn(),
  },
} satisfies Meta<typeof Menu>

export default meta
type Story = StoryObj<typeof meta>

// Кликните по триггеру: список откроется, выбранный пункт отмечен галочкой
export const Default: Story = {}

export const AlignStart: Story = {
  args: { align: 'start' },
  render: () => <Controlled initial="nur" onSelect={fn()} />,
}
