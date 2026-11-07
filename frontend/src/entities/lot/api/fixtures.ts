// Демо-данные вместо бэкенда, по контракту docs/api-contract.md.
// Допуск рассчитан заранее под каждого персонажа — на бэкенде его считают формулы.
import type { Localized } from '@/shared/api'
import type { Lot, MyAdmission, ProductCode, Reason } from '../model/types'

type Lang = 'ru' | 'uz'

type LotFixture = {
  id: string
  product: { code: ProductCode; name: Localized }
  seller: { id: string; name: Localized; city: Localized; rating: number }
  volumeT: number
  pricePerT: number
  deliveryUntil: string
}

const FERGANA: Localized = { ru: 'Фергана', uz: 'Farg‘ona' }

const LOTS: LotFixture[] = [
  {
    id: 'cement-40',
    product: {
      code: 'cement',
      name: { ru: 'Цемент М400 в мешках', uz: 'M400 sement, qoplarda' },
    },
    seller: {
      id: 'fergana-cement',
      name: { ru: 'Ферганский цементный завод', uz: 'Farg‘ona sement zavodi' },
      city: FERGANA,
      rating: 88,
    },
    volumeT: 40,
    pricePerT: 900_000,
    deliveryUntil: '2026-11-20',
  },
  {
    id: 'flour-90',
    product: {
      code: 'flour',
      name: { ru: 'Мука высшего сорта', uz: 'Oliy navli un' },
    },
    seller: {
      id: 'fergana-mill',
      name: { ru: 'Ферганский мелькомбинат', uz: 'Farg‘ona un kombinati' },
      city: FERGANA,
      rating: 92,
    },
    volumeT: 90,
    pricePerT: 4_732_000,
    deliveryUntil: '2026-11-14',
  },
  {
    id: 'sugar-60',
    product: { code: 'sugar', name: { ru: 'Сахар-песок', uz: 'Shakar qumi' } },
    seller: {
      id: 'khorezm-sugar',
      name: { ru: 'Хорезмский сахарный завод', uz: 'Xorazm shakar zavodi' },
      city: { ru: 'Ургенч', uz: 'Urganch' },
      rating: 76,
    },
    volumeT: 60,
    pricePerT: 11_800_000,
    deliveryUntil: '2026-11-25',
  },
  {
    id: 'cement-25',
    product: {
      code: 'cement',
      name: { ru: 'Цемент М500 навалом', uz: 'M500 sement, to‘kma' },
    },
    seller: {
      id: 'vostok-cement',
      name: { ru: 'Цементный завод «Восток»', uz: '«Vostok» sement zavodi' },
      city: { ru: 'Коканд', uz: 'Qo‘qon' },
      rating: 81,
    },
    volumeT: 25,
    pricePerT: 870_000,
    deliveryUntil: '2026-11-18',
  },
]

const NEWCOMER_LIMIT: Localized = {
  ru: 'Продавец не продаёт новичкам больше 5 т',
  uz: 'Sotuvchi yangi ishtirokchilarga 5 t dan ortiq sotmaydi',
}
const CEMENT_RULE: Localized = {
  ru: 'Не продавать новичкам больше 5 т, пускать от рейтинга 40',
  uz: 'Yangi ishtirokchilarga 5 t dan ortiq sotmaslik, reyting 40 dan boshlab',
}
const SUGAR_MIN_RATING: Localized = {
  ru: 'Продавец пускает участников от рейтинга 60',
  uz: 'Sotuvchi reytingi 60 dan yuqori ishtirokchilarni qabul qiladi',
}

function newcomerLimit(lang: Lang): MyAdmission {
  const reason: Reason = {
    code: 'rule_newcomer_volume',
    message: NEWCOMER_LIMIT[lang],
    ruleText: CEMENT_RULE[lang],
  }
  return { status: 'limited', maxVolumeT: 5, reason }
}

function sugarClosed(lang: Lang): MyAdmission {
  return {
    status: 'unavailable',
    reason: { code: 'rule_min_rating', message: SUGAR_MIN_RATING[lang] },
  }
}

/** Допуск к лоту по персонажу: newcomer — СтройПлюс и Барака */
function admissionFor(
  lotId: string,
  participantId: string,
  lang: Lang,
): MyAdmission {
  const newcomer = participantId === 'stroyplus' || participantId === 'baraka'
  if (lotId === 'cement-40' && newcomer) return newcomerLimit(lang)
  if (lotId === 'sugar-60' && newcomer) return sugarClosed(lang)
  return { status: 'available' }
}

export function lotsFixture(participantId: string, lang: Lang): Lot[] {
  return LOTS.map((lot) => ({
    id: lot.id,
    product: { code: lot.product.code, name: lot.product.name[lang] },
    seller: {
      id: lot.seller.id,
      name: lot.seller.name[lang],
      city: lot.seller.city[lang],
      rating: lot.seller.rating,
    },
    volumeT: lot.volumeT,
    pricePerT: lot.pricePerT,
    deliveryUntil: lot.deliveryUntil,
    myAdmission: admissionFor(lot.id, participantId, lang),
  }))
}
