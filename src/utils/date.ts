const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-03-02" → "02 Mar" */
export function formatDate(dateStr: string): string {
  const parts = dateStr.split('-');
  const month = parseInt(parts[1] ?? '1', 10) - 1;
  const day = parts[2] ?? '?';
  return `${day} ${MONTHS[month] ?? ''}`;
}
