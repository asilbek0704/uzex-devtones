// Ответ «как с сервера» для фикстур: асинхронно и с небольшой задержкой,
// чтобы состояния загрузки были видны и в разработке.
const DELAY_MS = import.meta.env.MODE === 'test' ? 0 : 300

export function mockResponse<T>(data: T, delay = DELAY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay))
}

/** Пара переводов в фикстурах: бэкенд отдаёт текст на языке из Accept-Language */
export type Localized = { ru: string; uz: string }
