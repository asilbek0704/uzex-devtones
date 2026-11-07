import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import {
  DepositScale,
  RatingBadge,
  useDepositTiers,
  useMe,
} from '@/entities/participant'
import { useCurrentPersona, usePersonaPath } from '@/features/switch-persona'
import { Card } from '@/shared/ui'
import s from './MyDeposit.module.scss'

/**
 * Тёмный остров «Ваш залог сейчас»: процент залога, уровень, рейтинг на шкале
 * уровней и шаг до следующего. Все цифры и уровни — из ответов бэкенда.
 */
export function MyDeposit() {
  const { t } = useTranslation()
  const { personaId } = useCurrentPersona()
  const personaPath = usePersonaPath()
  const me = useMe(personaId)
  const tiers = useDepositTiers()

  if (me.isError) {
    return (
      <Card variant="island" className={s.card}>
        <p className={s.muted}>{t('deposit.error')}</p>
      </Card>
    )
  }

  if (!me.data) {
    return <Card variant="island" className={s.card} aria-busy="true" />
  }

  const { deposit, participant } = me.data
  // Уровень бэкенд называет через tierMinRating — по нему берём подпись, ничего не считая
  const tier = tiers.data?.find(
    (item) => item.minRating === deposit.tierMinRating,
  )

  return (
    <Card variant="island" className={s.card}>
      <h2 className={s.title}>{t('deposit.title')}</h2>

      <div className={s.pct}>{deposit.pct}%</div>
      <p className={s.meta}>
        <span className={s.rating}>
          {t('deposit.rating')}
          <RatingBadge rating={participant.rating} />
        </span>
        {tier && <span>{tier.label}</span>}
      </p>

      <DepositScale
        rating={participant.rating}
        tiers={tiers.data}
        nextRating={deposit.next?.rating}
        aria-label={t('deposit.scaleLabel', {
          rating: participant.rating,
          pct: deposit.pct,
        })}
      />
      <p className={s.legend}>{t('deposit.scaleLegend')}</p>

      <p className={s.next}>
        {deposit.next ? (
          <Trans
            i18nKey="deposit.next"
            count={deposit.next.dealsNeeded}
            values={{ rating: deposit.next.rating, pct: deposit.next.pct }}
            components={{ b: <b /> }}
          />
        ) : (
          t('deposit.best')
        )}
      </p>

      <Link to={personaPath('/profile')} className={s.link}>
        {t('deposit.how')}
      </Link>
    </Card>
  )
}
