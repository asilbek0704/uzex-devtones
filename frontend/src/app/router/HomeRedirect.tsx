import { Navigate } from 'react-router'
import {
  personaHome,
  useCurrentPersona,
  usePersonaPath,
} from '@/features/switch-persona'

/** «/» ведёт на стартовый экран роли текущего персонажа */
export function HomeRedirect() {
  const { persona } = useCurrentPersona()
  const personaPath = usePersonaPath()
  if (!persona) return null
  return <Navigate to={personaPath(personaHome(persona.kind))} replace />
}
