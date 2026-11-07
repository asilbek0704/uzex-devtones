// Кросс-импорт для сущности lot (соглашение FSD @x): фикстуре расчёта заявки
// нужен залог участника — так же, как бэкенду нужен его рейтинг.
import { meFixture } from '../api/fixtures'

export function participantForQuote(participantId: string, lang: 'ru' | 'uz') {
  const me = meFixture(participantId, lang)
  return {
    name: me.participant.name,
    rating: me.participant.rating,
    isNewcomer: me.isNewcomer,
    deposit: me.deposit,
  }
}
