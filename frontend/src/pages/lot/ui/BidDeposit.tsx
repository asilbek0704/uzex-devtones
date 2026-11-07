import { Trans, useTranslation } from 'react-i18next'
import type { Quote } from '@/entities/lot'
import {
  DepositScale,
  RatingBadge,
  useDepositTiers,
} from '@/entities/participant'
import { useLanguage } from '@/shared/i18n'
import { cn, formatNumber } from '@/shared/lib'
import { Card } from '@/shared/ui'
import s from './BidDeposit.module.scss'

type BidDepositProps = {
  quote: Quote | undefined
  rating: number
  /** Расчёт устарел: объём уже изменён, новый ещё не пришёл */
  stale: boolean
}

/** Тёмный остров: залог по этой заявке — процент, сумма, уровень, шаг дальше */
export function BidDeposit({ quote, rating, stale }: BidDepositProps) {
  const { t } = useTranslation()
  const lang = useLanguage()
  const tiers = useDepositTiers()

  if (!quote)
    return <Card variant="island" className={s.card} aria-busy="true" />

  const { deposit } = quote
  const tier = tiers.data?.find(
    (item) => item.minRating === deposit.tierMinRating,
  )
  const money = (value: number) =>
    `${formatNumber(value, lang)} ${t('units.sum')}`

  return (
    <Card
      variant="island"
      className={cn(s.card, stale && s.stale)}
      aria-live="polite"
    >
      <h2 className={s.title}>
        {quote.admitted
          ? t('lotPage.deposit.title')
          : t('lotPage.deposit.titleRating', { rating })}
      </h2>

      <div className={s.pct}>{deposit.pct}%</div>
      {quote.admitted ? (
        <p className={s.amount}>
          <b>{money(deposit.amount)}</b>{' '}
          {t('lotPage.deposit.of', {
            goods: money(quote.goodsAmount),
            volume: formatNumber(quote.volumeT, lang),
          })}
        </p>
      ) : (
        <p className={s.amount}>{t('lotPage.deposit.blocked')}</p>
      )}

      <p className={s.meta}>
        <span className={s.rating}>
          {t('deposit.rating')}
          <RatingBadge rating={rating} />
        </span>
        {tier && <span>{tier.label}</span>}
      </p>

      <DepositScale
        rating={rating}
        tiers={tiers.data}
        nextRating={deposit.next?.rating}
        aria-label={t('deposit.scaleLabel', { rating, pct: deposit.pct })}
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
    </Card>
  )
}
