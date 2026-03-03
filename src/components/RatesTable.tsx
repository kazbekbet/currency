import { SUPPORTED_CURRENCIES } from '../types'
import { CURRENCY_META } from '../constants/currencies'
import { formatAmount } from '../utils/convert'
import { Sparkline } from './Sparkline'
import type { Rates, TrendsMap } from '../types'
import type { SparklineData } from '../hooks/useSparkline'

interface Props {
  rates: Rates | null
  loading: boolean
  trends: TrendsMap
  trendLoading: boolean
  trendDays: number
  sparklines: SparklineData
}

const DIRECTION_ICON: Record<string, string> = { up: '↑', down: '↓', stable: '→' }

export function RatesTable({ rates, loading, trends, trendLoading, trendDays, sparklines }: Props) {
  return (
    <div className="rates-table">
      <div className="rates-table__header">
        <p className="rates-table__title">Rates (base: 1 USD)</p>
        <p className="rates-table__subtitle">Тренд {trendDays} дн.</p>
      </div>
      <div className="rates-table__grid">
        {SUPPORTED_CURRENCIES.map((c) => {
          const meta = CURRENCY_META[c]
          const value = rates?.values[c]
          const trend = trends[c]
          const sparkValues = sparklines[c]
          const isUSD = c === 'USD'

          return (
            <div key={c} className="rate-row">
              <span className="rate-row__flag">{meta.flag}</span>
              <span className="rate-row__code">{meta.code}</span>

              {/* Sparkline */}
              <span className="rate-row__spark">
                {!isUSD && sparkValues
                  ? <Sparkline values={sparkValues} />
                  : !isUSD && <span className="skeleton skeleton--spark" />
                }
              </span>

              <span className="rate-row__value">
                {loading || !value ? <span className="skeleton" /> : formatAmount(value, 4)}
              </span>

              {!isUSD && (
                <span className={`trend-badge trend-badge--${trendLoading ? 'loading' : (trend?.direction ?? 'stable')}`}>
                  {trendLoading ? (
                    <span className="skeleton skeleton--sm" />
                  ) : trend ? (
                    <>
                      <span className="trend-badge__icon">{DIRECTION_ICON[trend.direction]}</span>
                      <span className="trend-badge__pct">
                        {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </span>
              )}
              {isUSD && <span className="trend-badge trend-badge--base">base</span>}
            </div>
          )
        })}
      </div>
      <p className="rates-table__disclaimer">
        ⚠️ На основе данных за {trendDays} дней · Не является финансовым советом
      </p>
    </div>
  )
}
