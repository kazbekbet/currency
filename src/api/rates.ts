import { SUPPORTED_CURRENCIES } from '../types'
import type { Rates } from '../types'

function endpoints(date: 'latest' | string) {
  return [
    `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${date}/v1/currencies/usd.json`,
    date === 'latest'
      ? 'https://latest.currency-api.pages.dev/v1/currencies/usd.json'
      : `https://${date}.currency-api.pages.dev/v1/currencies/usd.json`,
  ]
}

async function tryFetch(urls: string[]): Promise<Response> {
  for (const url of urls) {
    try {
      const res = await fetch(url)
      if (res.ok) return res
    } catch {
      // try next
    }
  }
  throw new Error('All API endpoints failed')
}

async function parseRates(res: Response): Promise<Rates> {
  const data = await res.json()
  const values = Object.fromEntries(
    SUPPORTED_CURRENCIES.map((c) => [c, c === 'USD' ? 1 : data.usd[c.toLowerCase()]])
  ) as Rates['values']
  return { base: 'USD', date: data.date, values }
}

export async function fetchRates(): Promise<Rates> {
  const res = await tryFetch(endpoints('latest'))
  return parseRates(res)
}

export function getDateNDaysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export async function fetchHistoricalRates(date: string): Promise<Rates> {
  const res = await tryFetch(endpoints(date))
  return parseRates(res)
}
