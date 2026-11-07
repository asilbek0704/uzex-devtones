import { parseAsString, useQueryState } from 'nuqs'
import { useCallback } from 'react'
import {
  DEFAULT_PERSONA_ID,
  usePersonas,
  type ParticipantKind,
} from '@/entities/participant'

// Персонаж живёт в URL (?as=stroyplus): каждый шаг питча — готовая ссылка.
// shallow: false — смена идёт через роутер, чтобы его location не отставал от URL.
const personaParam = parseAsString
  .withDefault(DEFAULT_PERSONA_ID)
  .withOptions({ shallow: false })

export function usePersonaId() {
  return useQueryState('as', personaParam)
}

/** Текущий персонаж; неизвестный id в URL заменяется персонажем по умолчанию */
export function useCurrentPersona() {
  const [personaId] = usePersonaId()
  const { data: personas, isPending } = usePersonas()
  const persona =
    personas?.find((p) => p.id === personaId) ??
    personas?.find((p) => p.id === DEFAULT_PERSONA_ID)
  return { personaId: persona?.id ?? personaId, persona, personas, isPending }
}

/** Ссылка с сохранением текущего персонажа: personaPath('/lots') → '/lots?as=stroyplus' */
export function usePersonaPath() {
  const { personaId } = useCurrentPersona()
  return useCallback(
    (path: string, id: string = personaId) =>
      `${path}?as=${encodeURIComponent(id)}`,
    [personaId],
  )
}

/** Стартовый экран роли */
export function personaHome(kind: ParticipantKind): string {
  return kind === 'seller' ? '/seller/lots/cement-40' : '/lots'
}
