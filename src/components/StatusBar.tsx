import { useEffect, useState } from 'react';
import { relativeTime } from '../utils/time';
import s from './StatusBar.module.css';
import type { RatesFetchStatus } from '../types';

interface Props {
  status: RatesFetchStatus;
  date: string | null | undefined;
  isFallback: boolean;
  updatedAt: number | null;
  onReload: () => void;
}

export function StatusBar({ status, date, isFallback, updatedAt, onReload }: Props) {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      tick((n) => n + 1);
    }, 30_000);
    return () => {
      clearInterval(id);
    };
  }, []);

  if (status === 'loading') {
    return (
      <div className={s.statusBar}>
        <span className={`${s.status} ${s.loading}`}>⏳ Загрузка курсов…</span>
      </div>
    );
  }

  if (isFallback) {
    return (
      <div className={s.statusBar}>
        <span className={`${s.status} ${s.fallback}`}>
          ⚠️ Статичные курсы
          <button
            className={s.retryBtn}
            onClick={() => {
              onReload();
            }}
          >
            Повторить
          </button>
        </span>
      </div>
    );
  }

  if (date) {
    return (
      <div className={s.statusBar}>
        <span className={`${s.status} ${s.live}`}>
          🟢 {date}
          {updatedAt && <span className={s.updated}>· {relativeTime(updatedAt)}</span>}
        </span>
      </div>
    );
  }

  return <div className={s.statusBar} />;
}
