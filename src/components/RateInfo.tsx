import { useState } from 'react';
import { CURRENCY_META } from '../constants/currencies';
import { copyToClipboard } from '../utils/clipboard';
import { formatAmount } from '../utils/convert';
import s from './RateInfo.module.css';
import type { Currency } from '../types';

interface Props {
  from: Currency;
  to: Currency;
  rate: number | null;
  toAmount: string;
}

export function RateInfo({ from, to, rate, toAmount }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const num = parseFloat(toAmount);
    if (isNaN(num)) return;
    const ok = await copyToClipboard(formatAmount(num));
    if (ok) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  if (!rate) return null;

  const fromMeta = CURRENCY_META[from];
  const toMeta = CURRENCY_META[to];

  return (
    <div className={s.bar}>
      <span className={s.text}>
        1 {fromMeta.flag} {from} = {formatAmount(rate, 4)} {toMeta.flag} {to}
      </span>
      <button
        className={`${s.copyBtn}${copied ? ` ${s.copied}` : ''}`}
        onClick={() => {
          void handleCopy();
        }}
        title="Скопировать результат"
        aria-label="Copy result"
      >
        {copied ? '✓' : '⎘'}
      </button>
    </div>
  );
}
