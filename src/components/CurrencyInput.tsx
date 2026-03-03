import { CURRENCY_META } from '../constants/currencies'
import s from './CurrencyInput.module.css'
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
    <div className={s.wrapper}>
      <label className={s.label}>{label}</label>
      <input
        className={s.input}
        type="number"
        min="0"
        value={amount}
        onChange={(e) => {
          onAmountChange(e.target.value)
        }}
        placeholder="0"
      />
      <div className={s.selectWrapper}>
        {currencies.map((c) => {
          const meta = CURRENCY_META[c]
          return (
            <button
              key={c}
              className={`${s.currencyBtn}${selectedCurrency === c ? ` ${s.active}` : ''}`}
              onClick={() => {
                onCurrencyChange(c)
              }}
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
