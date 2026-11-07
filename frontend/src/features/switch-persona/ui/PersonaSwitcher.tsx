import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { RatingBadge } from '@/entities/participant'
import { Menu } from '@/shared/ui'
import {
  personaHome,
  useCurrentPersona,
  usePersonaId,
  usePersonaPath,
} from '../model/persona'
import s from './PersonaSwitcher.module.scss'

/** «Войти как…»: смена участника демо в один клик, без логина */
export function PersonaSwitcher() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { persona, personas } = useCurrentPersona()
  const [, setPersonaId] = usePersonaId()
  const personaPath = usePersonaPath()

  if (!persona || !personas) return <div className={s.placeholder} />

  const roleLine = (kind: 'buyer' | 'seller', isNewcomer: boolean) =>
    isNewcomer
      ? `${t(`persona.role.${kind}`)} · ${t('persona.newcomer')}`
      : t(`persona.role.${kind}`)

  const select = (id: string) => {
    const next = personas.find((p) => p.id === id)
    if (!next || next.id === persona.id) return
    // Другая роль — свой стартовый экран; та же роль — остаёмся на месте
    if (next.kind !== persona.kind) {
      navigate(personaPath(personaHome(next.kind), next.id))
    } else {
      void setPersonaId(next.id)
    }
  }

  return (
    <Menu
      label={t('persona.switch')}
      selectedId={persona.id}
      onSelect={select}
      trigger={
        <span className={s.trigger}>
          <span className={s.who}>
            <span className={s.name}>{persona.name}</span>
            <span className={s.role}>
              {roleLine(persona.kind, persona.isNewcomer)}
            </span>
          </span>
          <RatingBadge rating={persona.rating} />
        </span>
      }
      items={personas.map((p) => ({
        id: p.id,
        content: (
          <span className={s.item}>
            <span className={s.who}>
              <span className={s.name}>{p.name}</span>
              <span className={s.role}>{p.description}</span>
            </span>
            <RatingBadge rating={p.rating} />
          </span>
        ),
      }))}
    />
  )
}
