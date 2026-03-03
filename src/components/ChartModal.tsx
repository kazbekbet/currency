import { useEffect, useState } from 'react';
import { CURRENCY_META } from '../constants/currencies';
import { useChartData } from '../hooks/useChartData';
import { formatAmount } from '../utils/convert';
import { formatDate } from '../utils/date';
import s from './ChartModal.module.css';
import type { Currency, Rates } from '../types';

interface Props {
  currency: Currency;
  rates: Rates | null;
  onClose: () => void;
}

const TIMEFRAMES = [7, 30, 90] as const;
type Days = (typeof TIMEFRAMES)[number];

// ── Full SVG chart ──────────────────────────────────────────────────────────

interface ChartPoint {
  date: string;
  value: number;
}

function FullChart({ data }: { data: ChartPoint[] }) {
  if (data.length < 2) return null;

  const W = 400;
  const H = 180;
  const pl = 52;
  const pr = 12;
  const pt = 12;
  const pb = 32;
  const cw = W - pl - pr;
  const ch = H - pt - pb;

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const px = (i: number) => pl + (i / (data.length - 1)) * cw;
  const py = (v: number) => pt + (1 - (v - min) / range) * ch;

  const pts = data.map((d, i) => [px(i), py(d.value)] as [number, number]);
  const linePath = pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');
  // data.length >= 2 is guaranteed by the guard above
  const lastPt = pts.at(-1) ?? pts[0]; // pts[0] is [n,n] (no noUncheckedIndexedAccess)
  const firstPt = pts[0];
  const areaPath = `${linePath} L${lastPt[0].toFixed(1)},${String(H - pb)} L${firstPt[0].toFixed(1)},${String(H - pb)} Z`;

  // Y labels
  const ySteps = 4;
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const t = i / ySteps;
    return { y: pt + (1 - t) * ch, value: min + t * range };
  });

  // X labels: spread evenly (max 5)
  const maxXLabels = 5;
  const xStep = Math.max(1, Math.ceil(data.length / maxXLabels));
  const xLabels = data
    .map((d, i) => ({ i, date: d.date }))
    .filter(({ i }) => i % xStep === 0 || i === data.length - 1);

  return (
    <svg
      viewBox={`0 0 ${String(W)} ${String(H)}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Grid lines + Y labels */}
      {yLabels.map(({ y, value }) => (
        <g key={value}>
          <line
            x1={pl}
            y1={y.toFixed(1)}
            x2={W - pr}
            y2={y.toFixed(1)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          <text
            x={String(pl - 5)}
            y={y.toFixed(1)}
            textAnchor="end"
            dominantBaseline="middle"
            fontSize="9"
            fill="rgba(255,255,255,0.3)"
          >
            {formatAmount(value, 2)}
          </text>
        </g>
      ))}

      {/* X labels */}
      {xLabels.map(({ i, date }) => (
        <text
          key={date}
          x={px(i).toFixed(1)}
          y={String(H - pb + 14)}
          textAnchor="middle"
          fontSize="9"
          fill="rgba(255,255,255,0.3)"
        >
          {formatDate(date)}
        </text>
      ))}

      {/* Area + line */}
      <path d={areaPath} fill="url(#chartGrad)" />
      <path
        d={linePath}
        fill="none"
        stroke="#a78bfa"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Last point dot */}
      <circle cx={lastPt[0].toFixed(1)} cy={lastPt[1].toFixed(1)} r="4" fill="#a78bfa" />
      <circle
        cx={lastPt[0].toFixed(1)}
        cy={lastPt[1].toFixed(1)}
        r="8"
        fill="#a78bfa"
        opacity="0.2"
      />
    </svg>
  );
}

// ── Modal ───────────────────────────────────────────────────────────────────

export function ChartModal({ currency, rates, onClose }: Props) {
  const [days, setDays] = useState<Days>(30);
  const { data, loading } = useChartData(currency, days);
  const meta = CURRENCY_META[currency];
  const currentRate = rates?.values[currency];

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  // Change over selected period
  const first = data[0]; // ChartPoint (non-nullable, guarded by data.length check)
  const last = data.at(-1); // ChartPoint | undefined
  const changePercent =
    last !== undefined && data.length >= 2
      ? ((last.value - first.value) / first.value) * 100
      : null;

  const isPositive = changePercent !== null && changePercent > 0;
  const isNegative = changePercent !== null && changePercent < 0;

  return (
    <div className={s.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={s.modal}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className={s.header}>
          <div className={s.currencyInfo}>
            <span className={s.flag}>{meta.flag}</span>
            <div>
              <h2 className={s.name}>{meta.name}</h2>
              <p className={s.pair}>{currency} / USD</p>
            </div>
          </div>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Current rate */}
        {currentRate && (
          <div className={s.currentRate}>
            <span>1 USD =</span>
            <strong>
              {formatAmount(currentRate, 4)} {currency}
            </strong>
          </div>
        )}

        {/* Timeframe */}
        <div className={s.tabs}>
          {TIMEFRAMES.map((d) => (
            <button
              key={d}
              className={`${s.tab}${days === d ? ` ${s.activeTab}` : ''}`}
              onClick={() => {
                setDays(d);
              }}
            >
              {String(d)}д
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className={s.chartArea}>
          {loading ? <div className={s.chartSkeleton} /> : <FullChart data={data} />}
        </div>

        {/* Footer: change */}
        <div className={s.footer}>
          <span className={s.footerLabel}>Изменение за {String(days)} дней</span>
          {changePercent !== null && (
            <span
              className={`${s.changeBadge} ${isPositive ? s.negative : isNegative ? s.positive : s.neutral}`}
            >
              {isPositive ? '↑' : isNegative ? '↓' : '→'} {Math.abs(changePercent).toFixed(2)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
