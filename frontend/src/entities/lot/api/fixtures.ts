// Демо-данные вместо бэкенда, по контракту docs/api-contract.md.
// Допуск рассчитан заранее под каждого персонажа — на бэкенде его считают формулы.
import type { Localized } from '@/shared/api'
import { participantForQuote } from '@/entities/participant/@x/lot'
import type {
  Bid,
  Lot,
  LotDetails,
  MyAdmission,
  ProductCode,
  Quote,
  Reason,
  SellerRule,
} from '../model/types'

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

const RULES: Record<string, SellerRule> = {
  'cement-40': { minRating: 40, newcomerMaxVolumeT: 5 },
  'sugar-60': { minRating: 60, newcomerMaxVolumeT: null },
}

export function lotFixture(
  lotId: string,
  participantId: string,
  lang: Lang,
): LotDetails | null {
  const lot = lotsFixture(participantId, lang).find((item) => item.id === lotId)
  return lot ? { ...lot, rule: RULES[lot.id] ?? null } : null
}

const VOLUME_EXCEEDS: Localized = {
  ru: 'В лоте меньше тонн, чем в заявке',
  uz: 'Lotda arizadagidan kamroq tonna bor',
}

/** Расчёт заявки — на бэкенде это делают открытые формулы PRD */
export function quoteFixture(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: Lang,
): Quote | null {
  const lot = lotFixture(lotId, participantId, lang)
  if (!lot) return null
  const me = participantForQuote(participantId, lang)
  const admission = lot.myAdmission

  let reason: Reason | null = null
  let maxVolumeT: number | null = null
  if (admission.status === 'unavailable') {
    reason = admission.reason
  } else if (volumeT > lot.volumeT) {
    reason = { code: 'volume_exceeds_lot', message: VOLUME_EXCEEDS[lang] }
    maxVolumeT = lot.volumeT
  } else if (admission.status === 'limited') {
    maxVolumeT = admission.maxVolumeT
    if (volumeT > admission.maxVolumeT) reason = admission.reason
  }

  const goodsAmount = volumeT * lot.pricePerT
  return {
    volumeT,
    admitted: reason === null,
    reason,
    maxVolumeT,
    goodsAmount,
    deposit: {
      pct: me.deposit.pct,
      amount: Math.round((goodsAmount * me.deposit.pct) / 100),
      tierMinRating: me.deposit.tierMinRating,
      next: me.deposit.next,
    },
    comparison: {
      uzexToday: { brokerRequired: true, depositPctMax: 10 },
      trustedExample: { rating: 92, depositPct: 1 },
    },
  }
}

const sum = (value: number, lang: Lang) =>
  `${new Intl.NumberFormat('ru-RU').format(value)} ${lang === 'uz' ? 'so‘m' : 'сум'}`

/** Пояснение ИИ к расчёту; цифры подставлены из формул, а не придуманы моделью */
export function quoteExplanationFixture(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: Lang,
): string {
  const quote = quoteFixture(lotId, participantId, volumeT, lang)
  if (!quote) return ''
  const me = participantForQuote(participantId, lang)
  const { deposit } = quote
  const ru = lang === 'ru'

  if (quote.reason?.code === 'rule_newcomer_volume') {
    return ru
      ? `Продавец задал правило: новичкам — не больше ${quote.maxVolumeT} т. У вас пока нет завершённых сделок, поэтому заявка на ${volumeT} т не проходит. Возьмите ${quote.maxVolumeT} т сейчас или доберите объём вместе с соседями в пуле.`
      : `Sotuvchi qoida belgilagan: yangi ishtirokchilarga ${quote.maxVolumeT} t dan oshmasin. Sizda hali yakunlangan bitimlar yo‘q, shuning uchun ${volumeT} t lik ariza o‘tmaydi. Hozir ${quote.maxVolumeT} t oling yoki qolganini qo‘shnilar bilan birgalikda xaridda oling.`
  }
  if (quote.reason?.code === 'rule_min_rating') {
    return ru
      ? `Продавец пускает участников с рейтингом от 60, а у вас ${me.rating}. Это правило одинаково для всех. Каждая честная сделка поднимает рейтинг — этот лот откроется, когда вы дойдёте до 60.`
      : `Sotuvchi reytingi 60 dan yuqori ishtirokchilarni qabul qiladi, sizniki esa ${me.rating}. Bu qoida hamma uchun bir xil. Har bir halol bitim reytingni oshiradi — 60 ga yetganingizda bu lot ochiladi.`
  }
  if (quote.reason?.code === 'volume_exceeds_lot') {
    return ru
      ? `В этом лоте ${quote.maxVolumeT} т — больше взять нельзя. Уменьшите объём или посмотрите другие лоты.`
      : `Bu lotda ${quote.maxVolumeT} t bor — undan ko‘p olib bo‘lmaydi. Hajmni kamaytiring yoki boshqa lotlarni ko‘ring.`
  }
  if (deposit.next) {
    return ru
      ? `Ваш залог ${deposit.pct}% — ${sum(deposit.amount, lang)}, потому что рейтинг ${me.rating}. Это как задаток на UZEX сегодня, только без брокера. Ещё ${deposit.next.dealsNeeded} честные сделки — рейтинг ${deposit.next.rating}, и залог снизится до ${deposit.next.pct}%.`
      : `Garovingiz ${deposit.pct}% — ${sum(deposit.amount, lang)}, chunki reytingingiz ${me.rating}. Bu bugungi UZEX dagi zakalat kabi, faqat brokersiz. Yana ${deposit.next.dealsNeeded} ta halol bitim — reyting ${deposit.next.rating}, garov ${deposit.next.pct}% gacha tushadi.`
  }
  const saved = Math.round((quote.goodsAmount * (10 - deposit.pct)) / 100)
  return ru
    ? `Ваш залог всего ${deposit.pct}% — ${sum(deposit.amount, lang)}: рейтинг ${me.rating} и ни одного срыва. При рейтинге 40 залог был бы 10%, так что честная история оставляет у вас в обороте ${sum(saved, lang)}.`
    : `Garovingiz atigi ${deposit.pct}% — ${sum(deposit.amount, lang)}: reyting ${me.rating} va birorta ham uzilish yo‘q. Reyting 40 bo‘lganda garov 10% bo‘lardi, ya’ni halol tarix aylanmangizda ${sum(saved, lang)} qoldiradi.`
}

export function bidFixture(
  lotId: string,
  participantId: string,
  volumeT: number,
  lang: Lang,
): Bid | Reason {
  const quote = quoteFixture(lotId, participantId, volumeT, lang)
  if (!quote || !quote.admitted) {
    return (
      quote?.reason ?? {
        code: 'volume_exceeds_lot',
        message: VOLUME_EXCEEDS[lang],
      }
    )
  }
  return {
    id: `bid-${Date.now()}`,
    lotId,
    volumeT,
    deposit: { pct: quote.deposit.pct, amount: quote.deposit.amount },
    status: 'deposit_held',
  }
}
