import { Trans, useTranslation } from 'react-i18next'
import { LotRow, useLots } from '@/entities/lot'
import { useCurrentPersona, usePersonaPath } from '@/features/switch-persona'
import { Button, ButtonLink, Heading, Lead, Mark } from '@/shared/ui'
import { MyDeposit } from '@/widgets/my-deposit'
import s from './LotsPage.module.scss'

/** Баннер входа в пул: на десктопе под островом, на телефоне — внутри списка */
function PoolBanner({ to, className }: { to: string; className: string }) {
  const { t } = useTranslation()
  return (
    <div className={className}>
      <div>
        <h2 className={s.poolTitle}>{t('lots.pool.title')}</h2>
        <p className={s.poolText}>{t('lots.pool.text')}</p>
      </div>
      <ButtonLink to={to} withArrow>
        {t('lots.pool.action')}
      </ButtonLink>
    </div>
  )
}

/** Сколько лотов показать на телефоне до баннера пула */
const POOL_BANNER_AFTER = 2

/** Каталог лотов с допуском текущего участника и его залогом */
export function LotsPage() {
  const { t } = useTranslation()
  const { personaId } = useCurrentPersona()
  const personaPath = usePersonaPath()
  const lots = useLots(personaId)

  return (
    <div className={s.screen}>
      <div className={s.head}>
        <Heading>
          <Trans i18nKey="lots.title" components={{ m: <Mark /> }} />
        </Heading>
        <Lead>{t('lots.lead')}</Lead>
      </div>

      <aside className={s.side}>
        <MyDeposit />
        <PoolBanner
          to={personaPath('/pools/new')}
          className={`${s.pool} ${s.poolDesktop}`}
        />
      </aside>

      <section className={s.main} aria-label={t('lots.listLabel')}>
        {lots.isPending && (
          <ul className={s.list} aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <li key={i} className={s.skeleton} />
            ))}
          </ul>
        )}

        {lots.isError && (
          <div className={s.state}>
            <p>{t('lots.error')}</p>
            <Button variant="ghost" onClick={() => void lots.refetch()}>
              {t('lots.retry')}
            </Button>
          </div>
        )}

        {lots.data?.length === 0 && (
          <p className={s.state}>{t('lots.empty')}</p>
        )}

        {lots.data && lots.data.length > 0 && (
          <ul className={s.list}>
            {lots.data.map((lot, index) => (
              <li key={lot.id}>
                <LotRow lot={lot} to={personaPath(`/lots/${lot.id}`)} />
                {index === POOL_BANNER_AFTER - 1 && (
                  <PoolBanner
                    to={personaPath('/pools/new')}
                    className={`${s.pool} ${s.poolMobile}`}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
