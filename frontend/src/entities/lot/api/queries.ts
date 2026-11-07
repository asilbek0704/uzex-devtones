import { keepPreviousData, useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { apiClient, mockResponse, participantHeaders } from '@/shared/api'
import { env } from '@/shared/config/env'
import { useLanguage } from '@/shared/i18n'
import type { Bid, Lot, LotDetails, Quote, Reason } from '../model/types'
import {
  bidFixture,
  lotFixture,
  lotsFixture,
  quoteExplanationFixture,
  quoteFixture,
} from './fixtures'

type Lang = 'ru' | 'uz'
const fixtureLang = (lang: string): Lang => (lang === 'uz' ? 'uz' : 'ru')

/** Ошибка API в формате контракта: {error: {code, message}} */
export class ApiError extends Error {
  readonly code: string
  readonly status: number

  constructor(code: string, message: string, status: number) {
    super(message)
    this.code = code
    this.status = status
  }
}

function toApiError(error: unknown): never {
  if (isAxiosError(error) && error.response?.data?.error) {
    const { code, message } = error.response.data.error
    throw new ApiError(code, message, error.response.status)
  }
  throw error
}

async function fetchLots(participantId: string, lang: string): Promise<Lot[]> {
  if (env.useMocks) {
    return mockResponse(lotsFixture(participantId, fixtureLang(lang)))
  }
  const { data } = await apiClient.get<Lot[]>('/lots', {
    headers: participantHeaders(participantId),
  })
  return data
}

async function fetchLot(
  lotId: string,
  participantId: string,
  lang: string,
): Promise<LotDetails> {
  if (env.useMocks) {
    const lot = lotFixture(lotId, participantId, fixtureLang(lang))
    if (!lot) throw new ApiError('lot_not_found', 'Лот не найден', 404)
    return mockResponse(lot)
  }
  return apiClient
    .get<LotDetails>(`/lots/${lotId}`, {
      headers: participantHeaders(participantId),
    })
    .then((res) => res.data, toApiError)
}

async function fetchQuote(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: string,
): Promise<Quote> {
  if (env.useMocks) {
    const quote = quoteFixture(lotId, participantId, volumeT, fixtureLang(lang))
    if (!quote) throw new ApiError('lot_not_found', 'Лот не найден', 404)
    return mockResponse(quote, 200)
  }
  return apiClient
    .get<Quote>(`/lots/${lotId}/quote`, {
      params: { volumeT },
      headers: participantHeaders(participantId),
    })
    .then((res) => res.data, toApiError)
}

async function fetchQuoteExplanation(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: string,
): Promise<string> {
  if (env.useMocks) {
    // ИИ отвечает дольше расчёта — задержка показывает состояние «ИИ пишет»
    const text = quoteExplanationFixture(
      lotId,
      participantId,
      volumeT,
      fixtureLang(lang),
    )
    return mockResponse(text, import.meta.env.MODE === 'test' ? 0 : 1100)
  }
  return apiClient
    .get<{ text: string }>(`/lots/${lotId}/quote/explanation`, {
      params: { volumeT },
      headers: participantHeaders(participantId),
    })
    .then((res) => res.data.text, toApiError)
}

async function postBid(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: string,
): Promise<Bid> {
  if (env.useMocks) {
    const result = bidFixture(lotId, participantId, volumeT, fixtureLang(lang))
    if ('code' in result) throw new ApiError(result.code, result.message, 422)
    return mockResponse(result, import.meta.env.MODE === 'test' ? 0 : 600)
  }
  return apiClient
    .post<Bid>(
      `/lots/${lotId}/bids`,
      { volumeT },
      { headers: participantHeaders(participantId) },
    )
    .then((res) => res.data, toApiError)
}

export function useLots(participantId: string) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['lots', participantId, lang],
    queryFn: () => fetchLots(participantId, lang),
  })
}

export function useLot(lotId: string, participantId: string) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['lot', lotId, participantId, lang],
    queryFn: () => fetchLot(lotId, participantId, lang),
    retry: (count, error) => !(error instanceof ApiError) && count < 1,
  })
}

export function useQuote(
  lotId: string,
  participantId: string,
  volumeT: number,
) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['quote', lotId, participantId, volumeT, lang],
    queryFn: () => fetchQuote(lotId, participantId, volumeT, lang),
    // Пока пересчитывается новый объём, показываем прошлый расчёт
    placeholderData: keepPreviousData,
    enabled: volumeT > 0,
  })
}

export function useQuoteExplanation(
  lotId: string,
  participantId: string,
  volumeT: number,
  enabled: boolean,
) {
  const lang = useLanguage()
  return useQuery({
    queryKey: ['quote-explanation', lotId, participantId, volumeT, lang],
    queryFn: () => fetchQuoteExplanation(lotId, participantId, volumeT, lang),
    enabled: enabled && volumeT > 0,
    staleTime: Infinity,
  })
}

export function usePlaceBid(lotId: string, participantId: string) {
  const lang = useLanguage()
  return useMutation({
    mutationFn: (volumeT: number) =>
      postBid(lotId, participantId, volumeT, lang),
  })
}

export type { Reason }
