import { createBrowserRouter } from 'react-router'
import { LotPage } from '@/pages/lot'
import { LotsPage } from '@/pages/lots'
import { StubPage } from '@/pages/stub'
import { UiKitPage } from '@/pages/ui-kit'
import { AppLayout } from './AppLayout'
import { HomeRedirect } from './HomeRedirect'
import { RootLayout } from './RootLayout'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: '/ui-kit', element: <UiKitPage /> },
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomeRedirect /> },
          { path: 'lots', element: <LotsPage /> },
          { path: 'lots/:lotId', element: <LotPage /> },
          { path: 'pools/:poolId', element: <StubPage screen="pool" /> },
          { path: 'seller/lots/:lotId', element: <StubPage screen="seller" /> },
          { path: 'profile', element: <StubPage screen="profile" /> },
          { path: '*', element: <StubPage screen="notFound" /> },
        ],
      },
    ],
  },
])
