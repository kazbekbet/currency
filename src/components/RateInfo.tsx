import { useState } from 'react'
import { CURRENCY_META } from '../constants/currencies'
import { formatAmount } from '../utils/convert'
import { copyToClipboard } from '../utils/clipboard'
import type { Currency } from '../types'

interface Props {
  from: Currency
  to: Currency
  rate: number | null
  toAmount: string
}

export function RateInfo({ from, to, rate, toAmount }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const num = parseFloat(toAmount)
    if (isNaN(num)) return
    const ok = await copyToClipboard(formatAmount(num))
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    }
  }

  if (!rate) return null

  const fromMeta = CURRENCY_META[from]
  const toMeta = CURRENCY_META[to]

  return (
    <div className="rate-info-bar">
      <span className="rate-info-bar__text">
        1 {fromMeta.flag} {from} = {formatAmount(rate, 4)} {toMeta.flag} {to}
      </span>
      <button
        className={`copy-btn${copied ? ' copy-btn--copied' : ''}`}
        onClick={handleCopy}
        title="Скопировать результат"
        aria-label="Copy result"
      >
        {copied ? '✓' : '⎘'}
      </button>
    </div>
  )
}
