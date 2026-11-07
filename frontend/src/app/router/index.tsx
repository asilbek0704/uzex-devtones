import { createBrowserRouter } from 'react-router'
import { HomePage } from '@/pages/home'
import { RootLayout } from './RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [{ path: '/', element: <HomePage /> }],
  },
])
