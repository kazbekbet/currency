import type { Currency, CurrencyMeta, Rates } from '../types';

export const CURRENCY_META: Record<Currency, CurrencyMeta> = {
  USD: { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  EUR: { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  RUB: { code: 'RUB', name: 'Russian Ruble', flag: '🇷🇺' },
  THB: { code: 'THB', name: 'Thai Baht', flag: '🇹🇭' },
};

export const FALLBACK_RATES: Rates = {
  base: 'USD',
  date: 'static',
  values: { USD: 1, EUR: 0.92, RUB: 90.5, THB: 35.2 },
};
