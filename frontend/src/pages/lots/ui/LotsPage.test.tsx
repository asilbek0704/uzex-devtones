import { screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { LotsPage } from './LotsPage'

describe('LotsPage', () => {
  it('новичку показывает ограничения допуска и залог 10%', async () => {
    renderWithProviders(<LotsPage />, {
      url: '/lots?as=stroyplus',
      path: '/lots',
    })

    const cement = await screen.findByRole('link', { name: /Цемент М400/ })
    expect(within(cement).getByText('Вам — до 5 т')).toBeInTheDocument()

    const sugar = screen.getByRole('link', { name: /Сахар-песок/ })
    expect(
      within(sugar).getByText('Продавец пускает участников от рейтинга 60'),
    ).toBeInTheDocument()

    expect(
      await screen.findByRole('img', { name: 'Рейтинг 40 из 100, залог 10%' }),
    ).toBeInTheDocument()
  })

  it('надёжному участнику открыт весь объём и залог 1%', async () => {
    renderWithProviders(<LotsPage />, {
      url: '/lots?as=megastroy',
      path: '/lots',
    })

    const cement = await screen.findByRole('link', { name: /Цемент М400/ })
    expect(within(cement).getByText('Можно весь объём')).toBeInTheDocument()
    expect(
      await screen.findByRole('img', { name: 'Рейтинг 92 из 100, залог 1%' }),
    ).toBeInTheDocument()
  })

  it('ссылки сохраняют текущего персонажа', async () => {
    renderWithProviders(<LotsPage />, { url: '/lots?as=baraka', path: '/lots' })

    const cement = await screen.findByRole('link', { name: /Цемент М400/ })
    expect(cement).toHaveAttribute('href', '/lots/cement-40?as=baraka')
    // Баннер пула есть и в колонке (десктоп), и в списке (телефон) — CSS показывает один
    for (const link of screen.getAllByRole('link', { name: 'Объединиться' })) {
      expect(link).toHaveAttribute('href', '/pools/new?as=baraka')
    }
  })
})
