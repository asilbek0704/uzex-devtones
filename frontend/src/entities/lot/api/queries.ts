import { useQuery } from '@tanstack/react-query'
import { apiClient, mockResponse, participantHeaders } from '@/shared/api'
import { env } from '@/shared/config/env'
import { useLanguage } from '@/shared/i18n'
import type { Lot } from '../model/types'
import { lotsFixture } from './fixtures'

async function fetchLots(participantId: string, lang: string): Promise<Lot[]> {
  if (env.useMocks) {
    return mockResponse(lotsFixture(participantId, lang === 'uz' ? 'uz' : 'ru'))
  }
  const { data } = await apiClient.get<Lot[]>('/lots', {
    headers: participantHeaders(participantId),
  })
  return data
}

export function useLots(participantId: string) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['lots', participantId, lang],
    queryFn: () => fetchLots(participantId, lang),
  })
}
