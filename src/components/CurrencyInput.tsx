import { CURRENCY_META } from '../constants/currencies'
import type { Currency } from '../types'

interface Props {
  label: string
  amount: string
  onAmountChange: (v: string) => void
  selectedCurrency: Currency
  currencies: readonly Currency[]
  onCurrencyChange: (c: Currency) => void
}

export function CurrencyInput({
  label,
  amount,
  onAmountChange,
  selectedCurrency,
  currencies,
  onCurrencyChange,
}: Props) {
  return (
    <div className="currency-input">
      <label className="label">{label}</label>
      <input
        className="input"
        type="number"
        min="0"
        value={amount}
        onChange={(e) => onAmountChange(e.target.value)}
        placeholder="0"
      />
      <div className="select-wrapper">
        {currencies.map((c) => {
          const meta = CURRENCY_META[c]
          return (
            <button
              key={c}
              className={`currency-btn${selectedCurrency === c ? ' active' : ''}`}
              onClick={() => onCurrencyChange(c)}
              aria-pressed={selectedCurrency === c}
            >
              {meta.flag} {meta.code}
            </button>
          )
        })}
      </div>
    </div>
  )
}
