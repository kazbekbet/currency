import { useState, useMemo, useEffect } from 'react'
import { SUPPORTED_CURRENCIES } from '../types'
import { convert } from '../utils/convert'
import type { Currency, Rates } from '../types'

function fmtInput(n: number, decimals = 4): string {
  if (!isFinite(n) || isNaN(n)) return ''
  // Trim trailing zeros up to 2 decimal places minimum
  const fixed = parseFloat(n.toFixed(decimals))
  return fixed.toString()
}

function readUrlParam(key: string, valid: readonly string[], fallback: Currency): Currency {
  const v = new URLSearchParams(window.location.search).get(key)?.toUpperCase()
  return (valid.includes(v as Currency) ? v : fallback) as Currency
}

export function useConverter(rates: Rates | null) {
  const [fromAmount, setFromAmountRaw] = useState<string>('1')
  const [toAmount, setToAmountRaw] = useState<string>('')
  const [from, setFrom] = useState<Currency>(() =>
    readUrlParam('from', SUPPORTED_CURRENCIES, 'USD')
  )
  const [to, setTo] = useState<Currency>(() => readUrlParam('to', SUPPORTED_CURRENCIES, 'RUB'))

  // Recompute toAmount when rates first arrive (or reload)
  useEffect(() => {
    if (!rates) return
    const num = parseFloat(fromAmount)
    if (!isNaN(num) && num >= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToAmountRaw(fmtInput(convert(num, from, to, rates)))
    }
  }, [rates]) // eslint-disable-line react-hooks/exhaustive-deps

  const setFromAmount = (v: string) => {
    setFromAmountRaw(v)
    if (!rates) return
    const num = parseFloat(v)
    setToAmountRaw(isNaN(num) || num < 0 ? '' : fmtInput(convert(num, from, to, rates)))
  }

  const setToAmount = (v: string) => {
    setToAmountRaw(v)
    if (!rates) return
    const num = parseFloat(v)
    setFromAmountRaw(isNaN(num) || num < 0 ? '' : fmtInput(convert(num, to, from, rates)))
  }

  const swap = () => {
    const prevFrom = from
    const prevTo = to
    const prevFromAmt = fromAmount
    const prevToAmt = toAmount
    setFrom(prevTo)
    setTo(prevFrom)
    setFromAmountRaw(prevToAmt)
    setToAmountRaw(prevFromAmt)
  }

  const selectFrom = (c: Currency) => {
    const newTo = c === to ? from : to
    setFrom(c)
    setTo(newTo)
    if (rates) {
      const num = parseFloat(fromAmount)
      setToAmountRaw(isNaN(num) ? '' : fmtInput(convert(num, c, newTo, rates)))
    }
  }

  const selectTo = (c: Currency) => {
    const newFrom = c === from ? to : from
    setTo(c)
    setFrom(newFrom)
    if (rates) {
      const num = parseFloat(fromAmount)
      setToAmountRaw(isNaN(num) ? '' : fmtInput(convert(num, newFrom, c, rates)))
    }
  }

  const rate = useMemo(() => {
    if (!rates) return null
    return convert(1, from, to, rates)
  }, [from, to, rates])

  return {
    fromAmount,
    setFromAmount,
    toAmount,
    setToAmount,
    from,
    to,
    selectFrom,
    selectTo,
    swap,
    rate,
    currencies: SUPPORTED_CURRENCIES,
  }
}
