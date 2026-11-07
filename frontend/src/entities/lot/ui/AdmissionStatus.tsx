import { useTranslation } from 'react-i18next'
import { StatusLabel } from '@/shared/ui'
import type { MyAdmission } from '../model/types'

/** Допуск текущего участника к лоту: весь объём / ограничение / нельзя */
export function AdmissionStatus({ admission }: { admission: MyAdmission }) {
  const { t } = useTranslation()

  if (admission.status === 'available') {
    return (
      <StatusLabel tone="positive">{t('lot.admission.available')}</StatusLabel>
    )
  }
  if (admission.status === 'limited') {
    return (
      <StatusLabel tone="warning">
        {t('lot.admission.limited', { max: admission.maxVolumeT })}
      </StatusLabel>
    )
  }
  return <StatusLabel tone="negative">{admission.reason.message}</StatusLabel>
}
