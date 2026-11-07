import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { NuqsAdapter } from 'nuqs/adapters/react-router/v8'
import type { ReactNode } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router'

/**
 * Рендер с провайдерами приложения: TanStack Query, роутер, nuqs.
 * path — маршрут, на котором рендерится ui; остальные пути ведут на заглушку.
 *
 * Роутер браузерный (поверх истории jsdom), а не в памяти: адаптер nuqs
 * для react-router читает window.location, как и в приложении.
 */
export function renderWithProviders(
  ui: ReactNode,
  { url = '/', path = '*' }: { url?: string; path?: string } = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  window.history.replaceState(null, '', url)
  const router = createBrowserRouter([
    {
      element: (
        <NuqsAdapter>
          <Outlet />
        </NuqsAdapter>
      ),
      children: [
        { path, element: ui },
        { path: '*', element: <p>other route</p> },
      ],
    },
  ])
  return {
    router,
    ...render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>,
    ),
  }
}
