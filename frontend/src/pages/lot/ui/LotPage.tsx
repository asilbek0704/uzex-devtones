import { parseAsInteger, useQueryState } from 'nuqs'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'
import {
  ApiError,
  useLot,
  usePlaceBid,
  useQuote,
  useQuoteExplanation,
  type LotDetails,
  type Quote,
} from '@/entities/lot'
import { RatingBadge } from '@/entities/participant'
import {
  useCurrentPersona,
  usePersonaId,
  usePersonaPath,
} from '@/features/switch-persona'
import { useLanguage } from '@/shared/i18n'
import { formatDate, formatNumber, useDebouncedValue } from '@/shared/lib'
import {
  AiNote,
  Button,
  ButtonLink,
  Card,
  Compare,
  CompareCell,
  FieldLabel,
  Heading,
  Hint,
  Icon,
  LiveStatus,
  NumberField,
  Tag,
  TagGroup,
} from '@/shared/ui'
import { BidDeposit } from './BidDeposit'
import s from './LotPage.module.scss'

const volumeParam = parseAsInteger.withDefault(5)

/** Экран 1: лот, объём заявки, допуск по правилам продавца и залог по рейтингу */
export function LotPage() {
  const { personaId } = useCurrentPersona()
  // Смена персонажа сбрасывает состояние заявки (поданную заявку, ошибки)
  return <LotScreen key={personaId} />
}

function LotScreen() {
  const { t } = useTranslation()
  const { lotId = '' } = useParams()
  const { personaId, persona } = useCurrentPersona()
  const personaPath = usePersonaPath()
  const lot = useLot(lotId, personaId)

  if (lot.isPending) {
    return (
      <div className={s.screen} aria-busy="true">
        <div className={s.head}>
          <div className={s.skeletonTitle} />
        </div>
      </div>
    )
  }

  if (lot.isError) {
    // 404 — лота нет; остальное (сеть, сервер) — повод повторить, а не «нет лота»
    const notFound = lot.error instanceof ApiError && lot.error.status === 404
    return (
      <div className={s.screen}>
        <div className={s.head}>
          <Heading>
            {notFound ? t('lotPage.notFound') : t('lotPage.loadError')}
          </Heading>
          <div className={s.headActions}>
            {!notFound && (
              <Button variant="ghost" onClick={() => void lot.refetch()}>
                {t('lots.retry')}
              </Button>
            )}
            <ButtonLink to={personaPath('/lots')} variant="ghost">
              {t('lotPage.backToLots')}
            </ButtonLink>
          </div>
        </div>
      </div>
    )
  }

  return (
    <LotBid
      lot={lot.data}
      personaId={personaId}
      rating={persona?.rating ?? 0}
    />
  )
}

function LotBid({
  lot,
  personaId,
  rating,
}: {
  lot: LotDetails
  personaId: string
  rating: number
}) {
  const { t } = useTranslation()
  const lang = useLanguage()
  const personaPath = usePersonaPath()

  const [volume, setVolume] = useQueryState('v', volumeParam)
  const debouncedVolume = useDebouncedValue(volume)
  const quote = useQuote(lot.id, personaId, debouncedVolume)
  const fresh =
    quote.data && !quote.isPlaceholderData && debouncedVolume === volume
  const explanation = useQuoteExplanation(
    lot.id,
    personaId,
    debouncedVolume,
    Boolean(fresh),
  )
  const placeBid = usePlaceBid(lot.id, personaId)
  const money = (value: number) =>
    `${formatNumber(value, lang)} ${t('units.sum')}`

  const canSubmit =
    Boolean(fresh && quote.data?.admitted) && !placeBid.isPending

  // Ошибка подачи: причина от бэкенда (уже на языке интерфейса) или сбой сети
  const rejected = placeBid.error instanceof ApiError
  const submitError = placeBid.isError
    ? rejected
      ? t('lotPage.submitError.rejected', { reason: placeBid.error.message })
      : t('lotPage.submitError.network')
    : null

  return (
    <div className={s.screen}>
      <div className={s.head}>
        <Link to={personaPath('/lots')} className={s.back}>
          <Icon name="arrow" size={18} className={s.backIcon} />
          {t('lotPage.backToLots')}
        </Link>
        <Heading>{lot.product.name}</Heading>
        <p className={s.seller}>
          <span className={s.sellerName}>
            {lot.seller.name}
            <RatingBadge rating={lot.seller.rating} />
          </span>
          <span>{lot.seller.city}</span>
        </p>
      </div>

      <div className={s.main}>
        <dl className={s.facts}>
          <div>
            <dt>{t('lotPage.facts.volume')}</dt>
            <dd>
              {formatNumber(lot.volumeT, lang)} {t('units.t')}
            </dd>
          </div>
          <div>
            <dt>{t('lotPage.facts.price')}</dt>
            <dd>{money(lot.pricePerT)}</dd>
          </div>
          <div>
            <dt>{t('lotPage.facts.delivery')}</dt>
            <dd>
              {t('lot.until', { date: formatDate(lot.deliveryUntil, lang) })}
            </dd>
          </div>
          <div className={s.rulesFact}>
            <dt>{t('lotPage.rules.title')}</dt>
            <dd>
              {lot.rule ? (
                <TagGroup>
                  {lot.rule.minRating !== null && (
                    <Tag tone="paper">
                      {t('lotPage.rules.minRating', {
                        rating: lot.rule.minRating,
                      })}
                    </Tag>
                  )}
                  {lot.rule.newcomerMaxVolumeT !== null && (
                    <Tag tone="paper">
                      {t('lotPage.rules.newcomerMax', {
                        max: lot.rule.newcomerMaxVolumeT,
                      })}
                    </Tag>
                  )}
                </TagGroup>
              ) : (
                <span className={s.noRules}>{t('lotPage.rules.none')}</span>
              )}
            </dd>
          </div>
        </dl>

        {placeBid.isSuccess ? (
          <Card className={s.success} aria-live="polite">
            <LiveStatus status="done">{t('lotPage.success.status')}</LiveStatus>
            <p className={s.successText}>
              {t('lotPage.success.text', {
                volume: formatNumber(placeBid.data.volumeT, lang),
                amount: money(placeBid.data.deposit.amount),
              })}
            </p>
            <ButtonLink to={personaPath('/lots')} variant="ghost">
              {t('lotPage.backToLots')}
            </ButtonLink>
          </Card>
        ) : (
          <>
            <section className={s.volume}>
              <FieldLabel htmlFor="bid-volume">
                {t('lotPage.volume.label')}
              </FieldLabel>
              <div className={s.volumeRow}>
                <NumberField
                  id="bid-volume"
                  value={volume}
                  onChange={(next) => void setVolume(next)}
                  min={1}
                  max={lot.volumeT}
                  unit={t('units.t')}
                  decrementLabel={t('lotPage.volume.less')}
                  incrementLabel={t('lotPage.volume.more')}
                  aria-describedby="bid-goods"
                />
                <span id="bid-goods" className={s.goods}>
                  {quote.data &&
                    t('lotPage.volume.goods', {
                      amount: money(quote.data.goodsAmount),
                    })}
                </span>
              </div>
            </section>

            {quote.data && (
              <BidVerdict
                quote={quote.data}
                stale={!fresh}
                explanation={explanation.data}
                explanationPending={explanation.isFetching}
                explanationFailed={explanation.isError}
                onTakeMax={(max) => void setVolume(max)}
                poolPath={personaPath('/pools/new')}
                lotsPath={personaPath('/lots')}
              />
            )}
          </>
        )}
      </div>

      {!placeBid.isSuccess && (
        <div className={s.act}>
          <Button
            withArrow
            disabled={!canSubmit}
            onClick={() => placeBid.mutate(volume)}
          >
            {placeBid.isPending
              ? t('lotPage.submit.pending')
              : t('lotPage.submit.label', {
                  volume: formatNumber(volume, lang),
                })}
          </Button>
          {submitError ? (
            <div className={s.error} role="alert">
              <p>{submitError}</p>
              {!rejected && (
                <Button variant="ghost" onClick={() => placeBid.mutate(volume)}>
                  {t('lots.retry')}
                </Button>
              )}
            </div>
          ) : (
            quote.data?.admitted && (
              <Hint className={s.actionHint}>
                {t('lotPage.submit.hint', {
                  amount: money(quote.data.deposit.amount),
                })}
              </Hint>
            )
          )}
        </div>
      )}

      <aside className={s.side}>
        <BidDeposit quote={quote.data} rating={rating} stale={!fresh} />
        {quote.data && <EntryCost quote={quote.data} rating={rating} />}
      </aside>
    </div>
  )
}

type BidVerdictProps = {
  quote: Quote
  stale: boolean
  explanation: string | undefined
  explanationPending: boolean
  explanationFailed: boolean
  onTakeMax: (max: number) => void
  poolPath: string
  lotsPath: string
}

/** Допуск заявки: проходит или нет, причина по правилу продавца и пояснение ИИ */
function BidVerdict({
  quote,
  stale,
  explanation,
  explanationPending,
  explanationFailed,
  onTakeMax,
  poolPath,
  lotsPath,
}: BidVerdictProps) {
  const { t } = useTranslation()
  const thinking = stale || explanationPending
  const { reason } = quote

  const title = quote.admitted
    ? t('lotPage.verdict.ok', { volume: quote.volumeT })
    : (reason?.message ?? '')

  return (
    <AiNote
      className={s.verdict}
      badge={thinking ? t('lotPage.verdict.thinking') : t('lotPage.verdict.ai')}
      thinking={thinking}
      title={title}
      text={explanationFailed ? t('lotPage.verdict.aiFailed') : explanation}
      textPending={thinking && !explanationFailed}
      reveal
      revealTitle={false}
    >
      {reason?.ruleText && (
        <blockquote className={s.rule}>
          <span className={s.ruleLabel}>{t('lotPage.verdict.ruleLabel')}</span>«
          {reason.ruleText}»
        </blockquote>
      )}
      {!quote.admitted && (
        <div className={s.verdictActions}>
          {quote.maxVolumeT !== null && (
            <Button
              variant="ghost"
              onClick={() => onTakeMax(quote.maxVolumeT ?? 1)}
            >
              {t('lotPage.verdict.takeMax', { max: quote.maxVolumeT })}
            </Button>
          )}
          {reason?.code === 'rule_min_rating' ? (
            <ButtonLink to={lotsPath} variant="ghost">
              {t('lotPage.verdict.otherLots')}
            </ButtonLink>
          ) : (
            reason?.code !== 'volume_exceeds_lot' && (
              <ButtonLink to={poolPath} variant="ghost">
                {t('lotPage.verdict.pool')}
              </ButtonLink>
            )
          )}
        </div>
      )}
    </AiNote>
  )
}

/**
 * «Сколько стоит вход»: UZEX сегодня, ваш залог и — если вы не на вершине —
 * цель «рейтинг 92 → 1%» с переходом к такому участнику.
 */
function EntryCost({ quote, rating }: { quote: Quote; rating: number }) {
  const { t } = useTranslation()
  const { personas } = useCurrentPersona()
  const [, setPersonaId] = usePersonaId()
  const { uzexToday, trustedExample } = quote.comparison
  const trusted = personas?.find(
    (p) => p.kind === 'buyer' && p.rating === trustedExample.rating,
  )
  const showGoal = rating < trustedExample.rating

  return (
    <Card className={s.compareCard}>
      <h2 className={s.compareTitle}>{t('lotPage.compare.title')}</h2>
      <Compare stacked>
        <CompareCell
          label={t('lotPage.compare.uzex')}
          value={t('lotPage.compare.upTo', { pct: uzexToday.depositPctMax })}
          caption={t('lotPage.compare.uzexCaption')}
        />
        <CompareCell
          label={t('lotPage.compare.you', { rating })}
          value={`${quote.deposit.pct}%`}
          caption={t('lotPage.compare.youCaption')}
          highlighted={!showGoal}
        />
        {showGoal && (
          <CompareCell
            label={t('lotPage.compare.goal', { rating: trustedExample.rating })}
            value={`${trustedExample.depositPct}%`}
            caption={t('lotPage.compare.goalCaption')}
            highlighted
          />
        )}
      </Compare>
      {showGoal && trusted && (
        <Button
          variant="ghost"
          className={s.lookAs}
          onClick={() => void setPersonaId(trusted.id)}
        >
          {t('lotPage.compare.lookAs', { name: trusted.name })}
        </Button>
      )}
    </Card>
  )
}
