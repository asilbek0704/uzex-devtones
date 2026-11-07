import type { StorybookConfig } from '@storybook/react-vite'

// Витрина дизайн-системы: истории лежат рядом с компонентами в src/shared/ui
const config: StorybookConfig = {
  stories: ['../src/shared/ui/**/*.stories.@(ts|tsx)'],
  framework: '@storybook/react-vite',
}

export default config
