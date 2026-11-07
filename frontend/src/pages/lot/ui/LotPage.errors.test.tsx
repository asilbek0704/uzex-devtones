import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as fixtures from '@/entities/lot/api/fixtures'
import { renderWithProviders } from '@/test/render'
import { LotPage } from './LotPage'

const PATH = '/lots/:lotId'

afterEach(() => {
  vi.restoreAllMocks()
})

describe('LotPage — сбои', () => {
  it('если ИИ не ответил, цифры остаются, а вместо пояснения — честная фраза', async () => {
    vi.spyOn(fixtures, 'quoteExplanationFixture').mockImplementation(() => {
      throw new Error('LLM timeout')
    })
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=5',
      path: PATH,
    })

    // Текст ИИ проявляется по словам — ищем абзац по его полному тексту
    expect(
      await screen.findByText((_, el) =>
        Boolean(
          el?.tagName === 'P' &&
          el.textContent?.startsWith('Пояснение сейчас недоступно'),
        ),
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Заявку на 5 т можно подать')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Рейтинг 40 из 100, залог 10%' }),
    ).toBeInTheDocument()
  })

  it('ошибка подачи заявки видна пользователю (role=alert)', async () => {
    const user = userEvent.setup()
    vi.spyOn(fixtures, 'bidFixture').mockReturnValue({
      code: 'rule_newcomer_volume',
      message: 'Правило продавца изменилось — обновите страницу',
    })
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=5',
      path: PATH,
    })

    const submit = await screen.findByRole('button', {
      name: /Подать заявку на 5 т/,
    })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Правило продавца изменилось — обновите страницу',
    )
  })

  it('сетевая ошибка подачи: понятный текст и «Повторить»', async () => {
    const user = userEvent.setup()
    vi.spyOn(fixtures, 'bidFixture').mockImplementation(() => {
      throw new Error('Network Error')
    })
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus&v=5',
      path: PATH,
    })

    const submit = await screen.findByRole('button', {
      name: /Подать заявку на 5 т/,
    })
    await waitFor(() => expect(submit).toBeEnabled())
    await user.click(submit)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Не удалось отправить заявку')
    expect(alert).not.toHaveTextContent('Network Error')
    expect(
      screen.getByRole('button', { name: 'Повторить' }),
    ).toBeInTheDocument()
  })

  it('сбой загрузки лота — не «лота нет», а повтор', async () => {
    vi.spyOn(fixtures, 'lotFixture').mockImplementation(() => {
      throw new Error('Network Error')
    })
    renderWithProviders(<LotPage />, {
      url: '/lots/cement-40?as=stroyplus',
      path: PATH,
    })

    // Сетевую ошибку запрос один раз повторяет — ждём дольше обычного
    expect(
      await screen.findByText(
        'Не удалось загрузить лот',
        {},
        { timeout: 4000 },
      ),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Повторить' }),
    ).toBeInTheDocument()
  })
})
