import { CURRENCY_META } from '../constants/currencies';
import type { Currency } from '../types';

interface Props {
  label: string;
  value: Currency;
  currencies: readonly Currency[];
  onChange: (c: Currency) => void;
}

export function CurrencySelector({ label, value, currencies, onChange }: Props) {
  return (
    <div className="select-group">
      <label className="label">{label}</label>
      <div className="select-wrapper">
        {currencies.map((c) => {
          const meta = CURRENCY_META[c];
          return (
            <button
              key={c}
              className={`currency-btn${value === c ? ' active' : ''}`}
              onClick={() => {
                onChange(c);
              }}
              aria-pressed={value === c}
            >
              {meta.flag} {meta.code}
            </button>
          );
        })}
      </div>
    </div>
  );
}
