import { useQuery } from '@tanstack/react-query'
import { apiClient, mockResponse, participantHeaders } from '@/shared/api'
import { env } from '@/shared/config/env'
import { useLanguage } from '@/shared/i18n'
import type { DepositTier, Me, Persona } from '../model/types'
import { depositTiersFixture, meFixture, personasFixture } from './fixtures'

type Lang = 'ru' | 'uz'
const fixtureLang = (lang: string): Lang => (lang === 'uz' ? 'uz' : 'ru')

async function fetchPersonas(lang: string): Promise<Persona[]> {
  if (env.useMocks) return mockResponse(personasFixture(fixtureLang(lang)))
  const { data } = await apiClient.get<Persona[]>('/personas')
  return data
}

async function fetchMe(participantId: string, lang: string): Promise<Me> {
  if (env.useMocks) {
    return mockResponse(meFixture(participantId, fixtureLang(lang)))
  }
  const { data } = await apiClient.get<Me>('/participants/me', {
    headers: participantHeaders(participantId),
  })
  return data
}

async function fetchDepositTiers(lang: string): Promise<DepositTier[]> {
  if (env.useMocks) return mockResponse(depositTiersFixture(fixtureLang(lang)))
  const { data } = await apiClient.get<DepositTier[]>('/deposit-tiers')
  return data
}

export function usePersonas() {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['personas', lang],
    queryFn: () => fetchPersonas(lang),
    staleTime: Infinity,
  })
}

export function useMe(participantId: string) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['me', participantId, lang],
    queryFn: () => fetchMe(participantId, lang),
  })
}

export function useDepositTiers() {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['deposit-tiers', lang],
    queryFn: () => fetchDepositTiers(lang),
    staleTime: Infinity,
  })
}
