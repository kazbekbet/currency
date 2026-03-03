import { CURRENCY_META } from '../constants/currencies';
import { SUPPORTED_CURRENCIES } from '../types';
import { formatAmount } from '../utils/convert';
import s from './RatesTable.module.css';
import { Sparkline } from './Sparkline';
import type { SparklineData } from '../hooks/useSparkline';
import type { Currency, Rates, TrendsMap } from '../types';

interface Props {
  rates: Rates | null;
  loading: boolean;
  trends: TrendsMap;
  trendLoading: boolean;
  trendDays: number;
  sparklines: SparklineData;
  onCurrencyClick: (c: Currency) => void;
}

const DIRECTION_ICON: Record<string, string> = { up: '↑', down: '↓', stable: '→' };

export function RatesTable({
  rates,
  loading,
  trends,
  trendLoading,
  trendDays,
  sparklines,
  onCurrencyClick,
}: Props) {
  return (
    <div>
      <div className={s.header}>
        <p className={s.title}>Rates (base: 1 USD)</p>
        <p className={s.subtitle}>Тренд {String(trendDays)} дн.</p>
      </div>
      <div className={s.grid}>
        {SUPPORTED_CURRENCIES.map((c) => {
          const meta = CURRENCY_META[c];
          const value = rates?.values[c];
          const trend = trends[c];
          const sparkValues = sparklines[c];
          const isUSD = c === 'USD';

          return (
            <div
              key={c}
              className={`${s.row}${!isUSD ? ` ${s.clickable}` : ''}`}
              onClick={() => {
                if (!isUSD) onCurrencyClick(c);
              }}
              role={!isUSD ? 'button' : undefined}
              tabIndex={!isUSD ? 0 : undefined}
              onKeyDown={(e) => {
                if (!isUSD && (e.key === 'Enter' || e.key === ' ')) onCurrencyClick(c);
              }}
              aria-label={!isUSD ? `Open ${c} chart` : undefined}
            >
              <span className={s.flag}>{meta.flag}</span>
              <span className={s.code}>{meta.code}</span>

              <span className={s.spark}>
                {!isUSD && sparkValues ? (
                  <Sparkline values={sparkValues} />
                ) : (
                  !isUSD && <span className={`${s.skeleton} ${s.skeletonSpark}`} />
                )}
              </span>

              <span className={s.value}>
                {loading || !value ? <span className={s.skeleton} /> : formatAmount(value, 4)}
              </span>

              {!isUSD && (
                <span
                  className={`${s.trendBadge} ${trendLoading ? s.trendLoading : (s[trend?.direction ?? 'stable'] ?? s.stable)}`}
                >
                  {trendLoading ? (
                    <span className={`${s.skeleton} ${s.skeletonSm}`} />
                  ) : trend ? (
                    <>
                      <span className={s.trendIcon}>{DIRECTION_ICON[trend.direction]}</span>
                      <span className={s.trendPct}>
                        {trend.changePercent > 0 ? '+' : ''}
                        {trend.changePercent.toFixed(2)}%
                      </span>
                    </>
                  ) : (
                    <span>—</span>
                  )}
                </span>
              )}
              {isUSD && <span className={`${s.trendBadge} ${s.base}`}>base</span>}
            </div>
          );
        })}
      </div>
      <p className={s.disclaimer}>
        ⚠️ На основе данных за {String(trendDays)} дней · Не является финансовым советом
      </p>
    </div>
  );
}
