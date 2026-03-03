import { useEffect, useState } from 'react';
import { fetchHistoricalRates, getDateNDaysAgo } from '../api/rates';
import type { Currency } from '../types';

export interface ChartPoint {
  date: string;
  value: number;
}

const POINTS: Record<number, number> = {
  7: 7, // daily
  30: 10, // every ~3 days
  90: 13, // every ~7 days
};

export function useChartData(currency: Currency | null, days: number) {
  const [data, setData] = useState<ChartPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currency || currency === 'USD') return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setData([]);

    const n = POINTS[days] ?? 10;
    const step = Math.ceil(days / n);
    const dates = Array.from({ length: n }, (_, i) => getDateNDaysAgo(days - i * step));

    void Promise.allSettled(dates.map(fetchHistoricalRates)).then((results) => {
      if (cancelled) return;
      const points: ChartPoint[] = results
        .map((r, i) => {
          if (r.status !== 'fulfilled') return null;
          const val = r.value.values[currency];
          return val ? { date: dates[i] ?? '', value: val } : null;
        })
        .filter((p): p is ChartPoint => p !== null);
      setData(points);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [currency, days]);

  return { data, loading };
}
