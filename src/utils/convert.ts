import type { Currency, Rates } from '../types';

/**
 * Convert an amount between two currencies using a shared base (USD).
 * Pure function — no side effects.
 */
export function convert(amount: number, from: Currency, to: Currency, rates: Rates): number {
  if (from === to) return amount;
  const inBase = amount / rates.values[from];
  return inBase * rates.values[to];
}

export function formatAmount(value: number, fractionDigits = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: fractionDigits,
  });
}
