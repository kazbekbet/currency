import { useCallback, useEffect, useState } from 'react'
import type { ConversionEntry, Currency, Rates } from '../types'

const STORAGE_KEY = 'currency-history'
const MAX_ENTRIES = 6

function uuid(): string {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  // Fallback for HTTP / older Safari
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function load(): ConversionEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as ConversionEntry[]
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState<ConversionEntry[]>(load)

  const add = useCallback((entry: Omit<ConversionEntry, 'id' | 'timestamp'>) => {
    setHistory((prev) => {
      const deduped = prev.filter((e) => !(e.from === entry.from && e.to === entry.to))
      const next = [{ ...entry, id: uuid(), timestamp: Date.now() }, ...deduped].slice(
        0,
        MAX_ENTRIES
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { history, add }
}

export function useAutoSaveHistory(
  fromAmount: string,
  toAmount: string,
  from: Currency,
  to: Currency,
  rate: number | null,
  add: (e: Omit<ConversionEntry, 'id' | 'timestamp'>) => void,
  rates: Rates | null
) {
  useEffect(() => {
    const fa = parseFloat(fromAmount)
    const ta = parseFloat(toAmount)
    if (!rates || isNaN(fa) || fa <= 0 || isNaN(ta) || !rate) return

    const id = setTimeout(() => {
      add({ fromAmount: fa, toAmount: ta, from, to, rate })
    }, 1500)
    return () => {
      clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromAmount, toAmount, from, to])
}
