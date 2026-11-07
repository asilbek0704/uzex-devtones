import { useTranslation } from 'react-i18next'
import { usePersonaPath } from '@/features/switch-persona'
import { ButtonLink, Heading, Lead } from '@/shared/ui'
import s from './StubPage.module.scss'

export type StubScreen = 'lot' | 'pool' | 'seller' | 'profile' | 'notFound'

/** Временная страница для экранов, которые ещё не сделаны */
export function StubPage({ screen }: { screen: StubScreen }) {
  const { t } = useTranslation()
  const personaPath = usePersonaPath()

  return (
    <div className={s.screen}>
      <Heading>{t(`stub.${screen}`)}</Heading>
      <Lead>
        {t(screen === 'notFound' ? 'stub.notFoundText' : 'stub.text')}
      </Lead>
      <ButtonLink to={personaPath('/')} variant="ghost" className={s.back}>
        {t('stub.back')}
      </ButtonLink>
    </div>
  )
}
