import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from '../Icon/Icon'
import { VisuallyHidden } from './VisuallyHidden'

const meta = {
  title: 'UI/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs'],
  args: { children: 'Закрыть' },
} satisfies Meta<typeof VisuallyHidden>

export default meta
type Story = StoryObj<typeof meta>

// Текст не виден, но его читают скринридеры. Здесь он виден только в DevTools
export const Default: Story = {}

export const IconButton: Story = {
  render: () => (
    <button type="button" style={{ position: 'relative', padding: 8 }}>
      <Icon name="plus" />
      <VisuallyHidden>Добавить участника</VisuallyHidden>
    </button>
  ),
}
