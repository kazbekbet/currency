export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'RUB', 'THB'] as const
export type Currency = (typeof SUPPORTED_CURRENCIES)[number]

export interface CurrencyMeta {
  code: Currency
  name: string
  flag: string
}

export interface Rates {
  base: Currency
  date: string
  values: Record<Currency, number>
}

export type RatesFetchStatus = 'idle' | 'loading' | 'success' | 'error'

export interface RatesState {
  rates: Rates | null
  status: RatesFetchStatus
  isFallback: boolean
  error: string | null
  updatedAt: number | null
}

export type TrendDirection = 'up' | 'down' | 'stable'

export interface TrendInfo {
  changePercent: number
  direction: TrendDirection
}

export type TrendsMap = Partial<Record<Currency, TrendInfo>>

export interface ConversionEntry {
  id: string
  fromAmount: number
  toAmount: number
  from: Currency
  to: Currency
  rate: number
  timestamp: number
}
