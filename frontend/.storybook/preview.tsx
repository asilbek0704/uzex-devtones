import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router'
import '@fontsource/onest/400.css'
import '@fontsource/onest/500.css'
import '@/app/styles/index.scss'

// Глобальные стили приложения и шрифт — те же, что в приложении.
// MemoryRouter нужен компонентам со ссылками (ButtonLink).
const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
}

export default preview
