import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { RatingBadge } from '@/entities/participant'
import { useLanguage } from '@/shared/i18n'
import { formatDate, formatNumber } from '@/shared/lib'
import { Icon } from '@/shared/ui'
import type { Lot, ProductCode } from '../model/types'
import { AdmissionStatus } from './AdmissionStatus'
import s from './LotRow.module.scss'

const PRODUCT_COLOR: Record<ProductCode, string> = {
  flour: 'var(--flour)',
  sugar: 'var(--sugar)',
  cement: 'var(--cement)',
}

type LotRowProps = {
  lot: Lot
  /** Куда ведёт строка (с ?as= текущего персонажа) */
  to: string
}

/**
 * Строка каталога: товар, продавец, условия лота и допуск участника —
 * каждое своей строкой на всю ширину, чтобы длинные причины отказа
 * и узбекские тексты не сжимались в узкую колонку.
 */
export function LotRow({ lot, to }: LotRowProps) {
  const { t } = useTranslation()
  const lang = useLanguage()

  return (
    <Link to={to} className={s.row}>
      <span
        className={s.dot}
        style={{ background: PRODUCT_COLOR[lot.product.code] }}
        aria-hidden="true"
      />

      <span className={s.body}>
        <span className={s.name}>{lot.product.name}</span>
        <span className={s.seller}>
          <span className={s.sellerName}>
            {lot.seller.name}
            <RatingBadge rating={lot.seller.rating} />
          </span>
          <span>{lot.seller.city}</span>
        </span>
        <span className={s.facts}>
          <span>
            <b>
              {formatNumber(lot.volumeT, lang)} {t('units.t')}
            </b>{' '}
            {t('lot.volume')}
          </span>
          <span>
            <b>
              {formatNumber(lot.pricePerT, lang)} {t('units.sum')}
            </b>{' '}
            {t('lot.perTonne')}
          </span>
          <span>
            {t('lot.delivery')}{' '}
            <b>
              {t('lot.until', { date: formatDate(lot.deliveryUntil, lang) })}
            </b>
          </span>
        </span>
        <span className={s.admission}>
          <AdmissionStatus admission={lot.myAdmission} />
        </span>
      </span>

      <span className={s.arrow} aria-hidden="true">
        <Icon name="arrow" size={20} />
      </span>
    </Link>
  )
}
