import { CURRENCY_META } from '../constants/currencies'
import { formatAmount } from '../utils/convert'
import type { Currency } from '../types'

interface Props {
  amount: string
  from: Currency
  to: Currency
  result: number | null
  rate: number | null
}

export function ConversionResult({ amount, from, to, result, rate }: Props) {
  const fromMeta = CURRENCY_META[from]
  const toMeta = CURRENCY_META[to]
  const parsedAmount = parseFloat(amount)

  if (result === null || isNaN(parsedAmount)) {
    return <div className="result result--empty">Enter a valid amount</div>
  }

  return (
    <div className="result">
      <div className="result__from">
        {fromMeta.flag} {formatAmount(parsedAmount)} {from}
      </div>
      <div className="result__arrow">↓</div>
      <div className="result__to">
        {toMeta.flag}{' '}
        <span className="result__amount" key={result}>{formatAmount(result)}</span>{' '}
        {to}
      </div>
      {rate !== null && (
        <div className="result__rate">
          1 {from} = {formatAmount(rate, 4)} {to}
        </div>
      )}
    </div>
  )
}
