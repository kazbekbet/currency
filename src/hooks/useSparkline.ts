import { useEffect, useState } from 'react';
import { fetchHistoricalRates, getDateNDaysAgo } from '../api/rates';
import { SUPPORTED_CURRENCIES } from '../types';
import type { Currency, Rates } from '../types';

// 7 points: today + every 5 days back = ~30 day window
const POINTS = 7;
const STEP_DAYS = 5;

export type SparklineData = Partial<Record<Currency, number[]>>;

export function useSparkline(currentRates: Rates | null): SparklineData {
  const [data, setData] = useState<SparklineData>({});

  useEffect(() => {
    if (!currentRates) return;
    let cancelled = false;

    // dates from oldest to most recent (excluding today)
    const dates = Array.from({ length: POINTS - 1 }, (_, i) =>
      getDateNDaysAgo((POINTS - 1 - i) * STEP_DAYS)
    );

    void Promise.allSettled(dates.map(fetchHistoricalRates)).then((results) => {
      if (cancelled) return;
      const validRates = results
        .filter((r): r is PromiseFulfilledResult<Rates> => r.status === 'fulfilled')
        .map((r) => r.value);

      const allRates = [...validRates, currentRates]; // oldest → newest
      if (allRates.length < 2) return;

      const result: SparklineData = {};
      for (const c of SUPPORTED_CURRENCIES) {
        if (c === 'USD') continue;
        const values = allRates.map((r) => r.values[c]).filter(Boolean);
        if (values.length >= 2) result[c] = values;
      }
      setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, [currentRates]);

  return data;
}
