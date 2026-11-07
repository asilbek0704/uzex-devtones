// Демо-данные вместо бэкенда, по контракту docs/api-contract.md.
// Цифры залога — по таблице уровней PRD. Компании условные.
import type { Localized } from '@/shared/api'
import type { DepositTier, Me, Persona } from '../model/types'

type Lang = 'ru' | 'uz'
const pick = (text: Localized, lang: Lang) => text[lang]

type PersonaFixture = Omit<Persona, 'name' | 'city' | 'description'> & {
  name: Localized
  city: Localized
  description: Localized
}

const FERGANA: Localized = { ru: 'Фергана', uz: 'Farg‘ona' }

const PERSONAS: PersonaFixture[] = [
  {
    id: 'stroyplus',
    name: { ru: 'СтройПлюс', uz: 'StroyPlyus' },
    kind: 'buyer',
    city: FERGANA,
    rating: 40,
    isNewcomer: true,
    description: {
      ru: 'Новичок, сделок пока нет',
      uz: 'Yangi ishtirokchi, hali bitimlar yo‘q',
    },
  },
  {
    id: 'megastroy',
    name: { ru: 'Мегастрой', uz: 'Megastroy' },
    kind: 'buyer',
    city: { ru: 'Ташкент', uz: 'Toshkent' },
    rating: 92,
    isNewcomer: false,
    description: {
      ru: 'Надёжный участник, ни одного срыва',
      uz: 'Ishonchli ishtirokchi, birorta ham uzilish yo‘q',
    },
  },
  {
    id: 'baraka',
    name: { ru: 'Магазин «Барака»', uz: '«Baraka» do‘koni' },
    kind: 'buyer',
    city: FERGANA,
    rating: 42,
    isNewcomer: true,
    description: {
      ru: 'Малый бизнес, хочет купить вместе с соседями',
      uz: 'Kichik biznes, qo‘shnilar bilan birga xarid qilmoqchi',
    },
  },
  {
    id: 'fergana-cement',
    name: { ru: 'Ферганский цементный завод', uz: 'Farg‘ona sement zavodi' },
    kind: 'seller',
    city: FERGANA,
    rating: 88,
    isNewcomer: false,
    description: {
      ru: 'Продаёт цемент, задаёт правила допуска',
      uz: 'Sement sotadi, kirish qoidalarini belgilaydi',
    },
  },
]

export const DEFAULT_PERSONA_ID = 'stroyplus'

export function personasFixture(lang: Lang): Persona[] {
  return PERSONAS.map((p) => ({
    ...p,
    name: pick(p.name, lang),
    city: pick(p.city, lang),
    description: pick(p.description, lang),
  }))
}

const ME_DEPOSIT: Record<string, Me['deposit'] & { dealsCompleted: number }> = {
  stroyplus: {
    pct: 10,
    tierMinRating: 40,
    next: { pct: 6, rating: 60, dealsNeeded: 4 },
    dealsCompleted: 0,
  },
  megastroy: { pct: 1, tierMinRating: 90, next: null, dealsCompleted: 37 },
  baraka: {
    pct: 10,
    tierMinRating: 40,
    next: { pct: 6, rating: 60, dealsNeeded: 4 },
    dealsCompleted: 1,
  },
  'fergana-cement': {
    pct: 3,
    tierMinRating: 80,
    next: { pct: 1, rating: 90, dealsNeeded: 2 },
    dealsCompleted: 24,
  },
}

export function meFixture(participantId: string, lang: Lang): Me {
  const persona =
    personasFixture(lang).find((p) => p.id === participantId) ??
    personasFixture(lang)[0]
  const { dealsCompleted, ...deposit } =
    ME_DEPOSIT[persona.id] ?? ME_DEPOSIT[DEFAULT_PERSONA_ID]
  return {
    participant: {
      id: persona.id,
      name: persona.name,
      city: persona.city,
      rating: persona.rating,
    },
    kind: persona.kind,
    isNewcomer: persona.isNewcomer,
    dealsCompleted,
    deposit,
  }
}

const TIERS: (Omit<DepositTier, 'label'> & { label: Localized })[] = [
  {
    minRating: 0,
    maxRating: 39,
    pctMin: 15,
    pctMax: 15,
    label: {
      ru: 'Низкий рейтинг (после срывов)',
      uz: 'Past reyting (uzilishlardan keyin)',
    },
  },
  {
    minRating: 40,
    maxRating: 59,
    pctMin: 10,
    pctMax: 10,
    label: {
      ru: 'Новичок, растущий участник',
      uz: 'Yangi, o‘sib borayotgan ishtirokchi',
    },
  },
  {
    minRating: 60,
    maxRating: 79,
    pctMin: 6,
    pctMax: 6,
    label: { ru: 'Проверенный участник', uz: 'Tekshirilgan ishtirokchi' },
  },
  {
    minRating: 80,
    maxRating: 89,
    pctMin: 3,
    pctMax: 3,
    label: { ru: 'Надёжный участник', uz: 'Ishonchli ishtirokchi' },
  },
  {
    minRating: 90,
    maxRating: 100,
    pctMin: 0,
    pctMax: 1,
    label: { ru: 'Самые надёжные', uz: 'Eng ishonchlilar' },
  },
]

export function depositTiersFixture(lang: Lang): DepositTier[] {
  return TIERS.map((t) => ({ ...t, label: pick(t.label, lang) }))
}
