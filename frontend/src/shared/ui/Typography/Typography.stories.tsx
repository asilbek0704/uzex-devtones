import type { Meta, StoryObj } from '@storybook/react-vite'
import { FieldLabel, Heading, Hint, Lead, Mark } from './Typography'

const meta = {
  title: 'UI/Typography',
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const HeadingH1: Story = {
  render: () => (
    <Heading>
      Купите муку <Mark>вместе</Mark>
    </Heading>
  ),
}

export const HeadingH2: Story = {
  render: () => <Heading level={2}>Почему эти магазины</Heading>,
}

export const LeadText: Story = {
  render: () => (
    <Lead>
      Напишите как обычно говорите: товар, сколько, куда и к какому дню.
    </Lead>
  ),
}

export const FormParts: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8, justifyItems: 'start' }}>
      <FieldLabel htmlFor="tons">Сколько тонн муки</FieldLabel>
      <input id="tons" defaultValue="3" />
      <Hint>Одна машина развезёт всех по маршруту 14 ноября.</Hint>
    </div>
  ),
}
