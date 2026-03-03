import { CURRENCY_META } from '../constants/currencies';
import { formatAmount } from '../utils/convert';
import { relativeTime } from '../utils/time';
import s from './ConversionHistory.module.css';
import type { ConversionEntry, Currency } from '../types';

interface Props {
  history: ConversionEntry[];
  onRestore: (from: Currency, to: Currency, fromAmount: string) => void;
}

export function ConversionHistory({ history, onRestore }: Props) {
  if (history.length === 0) return null;

  return (
    <div>
      <p className={s.title}>История</p>
      <div className={s.list}>
        {history.map((e) => {
          const fromMeta = CURRENCY_META[e.from];
          const toMeta = CURRENCY_META[e.to];
          return (
            <button
              key={e.id}
              className={s.item}
              onClick={() => {
                onRestore(e.from, e.to, e.fromAmount.toString());
              }}
              title="Восстановить"
            >
              <span className={s.pair}>
                {fromMeta.flag} {formatAmount(e.fromAmount)} {e.from}
                <span className={s.arrow}>→</span>
                {toMeta.flag} {formatAmount(e.toAmount)} {e.to}
              </span>
              <span className={s.time}>{relativeTime(e.timestamp)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
