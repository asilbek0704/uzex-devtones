import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/home'
import { UiKitPage } from '@/pages/ui-kit'
import { RootLayout } from './RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/ui-kit', element: <UiKitPage /> },
    ],
  },
])
