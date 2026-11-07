import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderWithProviders } from '@/test/render'
import { LotPage } from './LotPage'

const PATH = '/lots/:lotId'

describe('LotPage — экран 1 питча', () => {
  it('новичку отказывает по правилу продавца и предлагает взять 5 т', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=8',
      path: PATH,
    })

    expect(
      await screen.findByText('Продавец не продаёт новичкам больше 5 т'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /Не продавать новичкам больше 5 т, пускать от рейтинга 40/,
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Подать заявку на 8 т/ }),
    ).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Взять 5 т' }))

    expect(
      await screen.findByText('Заявку на 5 т можно подать'),
    ).toBeInTheDocument()
    expect(screen.getByRole('spinbutton')).toHaveValue('5')
  })

  it('подаёт заявку с залогом 10% и показывает, где лежат деньги', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=5',
      path: PATH,
    })

    const submit = await screen.findByRole('button', {
      name: /Подать заявку на 5 т/,
    })
    await waitFor(() => expect(submit).toBeEnabled())
    expect(
      screen.getByRole('img', { name: 'Рейтинг 40 из 100, залог 10%' }),
    ).toBeInTheDocument()

    await user.click(submit)

    expect(await screen.findByText('Заявка подана')).toBeInTheDocument()
    expect(
      screen.getByText(/Залог 450\s000 сум лежит на гарантийном счёте/),
    ).toBeInTheDocument()
  })

  it('из сравнения переключает на участника с рейтингом 92 — залог 1%', async () => {
    const user = userEvent.setup()
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=5',
      path: PATH,
    })

    await user.click(
      await screen.findByRole('button', { name: 'Посмотреть как «Мегастрой»' }),
    )

    expect(
      await screen.findByRole('img', { name: 'Рейтинг 92 из 100, залог 1%' }),
    ).toBeInTheDocument()
    // Объём сохраняется, у надёжного участника правило новичков не действует
    expect(
      await screen.findByText('Заявку на 5 т можно подать'),
    ).toBeInTheDocument()
  })

  it('закрытый по рейтингу лот: причина и ссылка на другие лоты', async () => {
    renderWithProviders(<LotPage />, {
      url: '/lots/sugar-60?as=stroyplus&v=5',
      path: PATH,
    })

    expect(
      await screen.findByText('Продавец пускает участников от рейтинга 60'),
    ).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Другие лоты' })).toHaveAttribute(
      'href',
      '/lots?as=stroyplus',
    )
  })

  it('несуществующий лот', async () => {
    renderWithProviders(<LotPage />, {
      url: '/lots/nope?as=stroyplus',
      path: PATH,
    })
    expect(await screen.findByText('Такого лота нет')).toBeInTheDocument()
  })
})
