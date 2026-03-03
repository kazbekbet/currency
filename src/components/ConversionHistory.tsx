import { CURRENCY_META } from '../constants/currencies'
import { formatAmount } from '../utils/convert'
import { relativeTime } from '../utils/time'
import type { ConversionEntry, Currency } from '../types'

interface Props {
  history: ConversionEntry[]
  onRestore: (from: Currency, to: Currency, fromAmount: string) => void
}

export function ConversionHistory({ history, onRestore }: Props) {
  if (history.length === 0) return null

  return (
    <div className="history">
      <p className="history__title">История</p>
      <div className="history__list">
        {history.map((e) => {
          const fromMeta = CURRENCY_META[e.from]
          const toMeta = CURRENCY_META[e.to]
          return (
            <button
              key={e.id}
              className="history__item"
              onClick={() => onRestore(e.from, e.to, e.fromAmount.toString())}
              title="Восстановить"
            >
              <span className="history__pair">
                {fromMeta.flag} {formatAmount(e.fromAmount)} {e.from}
                <span className="history__arrow">→</span>
                {toMeta.flag} {formatAmount(e.toAmount)} {e.to}
              </span>
              <span className="history__time">{relativeTime(e.timestamp)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
