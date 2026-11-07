import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { PersonaSwitcher } from './PersonaSwitcher'

describe('PersonaSwitcher', () => {
  it('меняет персонажа той же роли, не уходя с экрана', async () => {
    const user = userEvent.setup()
    const { router } = renderWithProviders(<PersonaSwitcher />, {
      url: '/lots?as=stroyplus',
      path: '/lots',
    })

    await user.click(await screen.findByRole('button', { name: 'Войти как' }))
    await user.click(screen.getByRole('menuitemradio', { name: /Мегастрой/ }))

    // nuqs пишет URL асинхронно (склеивает частые обновления)
    await waitFor(() =>
      expect(router.state.location.search).toBe('?as=megastroy'),
    )
    expect(router.state.location.pathname).toBe('/lots')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('продавца уводит на его стартовый экран', async () => {
    const user = userEvent.setup()
    const { router } = renderWithProviders(<PersonaSwitcher />, {
      url: '/lots?as=stroyplus',
    })

    await user.click(await screen.findByRole('button', { name: 'Войти как' }))
    await user.click(
      screen.getByRole('menuitemradio', { name: /Ферганский цементный завод/ }),
    )

    expect(router.state.location.pathname).toBe('/seller/lots/cement-40')
    expect(router.state.location.search).toBe('?as=fergana-cement')
  })

  it('открывается стрелкой, закрывается по Escape и отмечает текущего', async () => {
    const user = userEvent.setup()
    renderWithProviders(<PersonaSwitcher />, { url: '/lots?as=baraka' })

    const trigger = await screen.findByRole('button', { name: 'Войти как' })
    trigger.focus()
    await user.keyboard('{ArrowDown}')

    const current = screen.getByRole('menuitemradio', { name: /Барака/ })
    expect(current).toHaveAttribute('aria-checked', 'true')
    expect(current).toHaveFocus()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
