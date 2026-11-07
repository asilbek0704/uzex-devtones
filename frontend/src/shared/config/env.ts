// Переменные окружения Vite должны начинаться с VITE_ (см. .env.example)
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  // Пока бэкенд не готов, данные берутся из фикстур по контракту docs/api-contract.md
  useMocks: import.meta.env.VITE_USE_MOCKS !== 'false',
} as const
