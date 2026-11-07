// Переменные окружения Vite должны начинаться с VITE_ (см. .env.example)
export const env = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
} as const
