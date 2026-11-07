import axios from 'axios'
import { env } from '@/shared/config/env'
import { i18n } from '@/shared/i18n'

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
})

// Тексты для пользователя (причины, пояснения ИИ) бэкенд отдаёт на языке интерфейса
apiClient.interceptors.request.use((config) => {
  config.headers.set('Accept-Language', i18n.resolvedLanguage ?? 'ru')
  return config
})

/** Заголовок с id текущего персонажа — заменяет авторизацию в демо */
export function participantHeaders(participantId: string) {
  return { 'X-Participant-Id': participantId }
}
