export function relativeTime(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000)
  if (s < 10)   return 'только что'
  if (s < 60)   return `${s} сек. назад`
  if (s < 3600) return `${Math.floor(s / 60)} мин. назад`
  if (s < 86400) return `${Math.floor(s / 3600)} ч. назад`
  return `${Math.floor(s / 86400)} д. назад`
}
