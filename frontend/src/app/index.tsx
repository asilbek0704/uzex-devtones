import { RouterProvider } from 'react-router'
import '@fontsource/onest/400.css'
import '@fontsource/onest/500.css'
import '@/shared/i18n'
import { AppProviders } from './providers'
import { router } from './router'
import './styles/index.scss'

export function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  )
}
