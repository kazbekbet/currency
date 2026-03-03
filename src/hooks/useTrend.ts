import { useEffect, useState } from 'react'
import { fetchHistoricalRates, getDateNDaysAgo } from '../api/rates'
import { SUPPORTED_CURRENCIES } from '../types'
import type { Rates, TrendInfo, TrendsMap } from '../types'

const TREND_DAYS = 7
const STABLE_THRESHOLD = 0.3 // % below which we consider stable

function calcTrend(current: Rates, historical: Rates): TrendsMap {
  const map: TrendsMap = {}

  for (const c of SUPPORTED_CURRENCIES) {
    if (c === 'USD') continue // base currency, always 1

    const now = current.values[c]
    const then = historical.values[c]
    if (!now || !then || then === 0) continue

    // rate = units of C per 1 USD
    // if rate rises → C weakened → negative for C holder
    // strengthChange: positive means C got stronger
    const rateChangePct = ((now - then) / then) * 100
    const changePercent = -rateChangePct

    const direction: TrendInfo['direction'] =
      Math.abs(changePercent) < STABLE_THRESHOLD ? 'stable' : changePercent > 0 ? 'up' : 'down'

    map[c] = { changePercent, direction }
  }

  return map
}

export function useTrend(currentRates: Rates | null) {
  const [trends, setTrends] = useState<TrendsMap>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentRates) return

    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)

    fetchHistoricalRates(getDateNDaysAgo(TREND_DAYS))
      .then((historical) => {
        if (!cancelled) setTrends(calcTrend(currentRates, historical))
      })
      .catch(() => {
        // silent: no trend data available
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [currentRates])

  return { trends, loading, days: TREND_DAYS }
}
