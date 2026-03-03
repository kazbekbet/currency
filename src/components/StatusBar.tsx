import { useEffect, useState } from 'react'
import { relativeTime } from '../utils/time'
import type { RatesFetchStatus } from '../types'

interface Props {
  status: RatesFetchStatus
  date: string | null | undefined
  isFallback: boolean
  updatedAt: number | null
  onReload: () => void
}

export function StatusBar({ status, date, isFallback, updatedAt, onReload }: Props) {
  // Tick every 30s to update "X мин. назад"
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  if (status === 'loading') {
    return (
      <div className="status-bar">
        <span className="status status--loading">⏳ Загрузка курсов…</span>
      </div>
    )
  }

  if (isFallback) {
    return (
      <div className="status-bar">
        <span className="status status--fallback">
          ⚠️ Статичные курсы
          <button className="retry-btn" onClick={onReload}>Повторить</button>
        </span>
      </div>
    )
  }

  if (date) {
    return (
      <div className="status-bar">
        <span className="status status--live">
          🟢 {date}
          {updatedAt && (
            <span className="status__updated">· {relativeTime(updatedAt)}</span>
          )}
        </span>
      </div>
    )
  }

  return <div className="status-bar" />
}
