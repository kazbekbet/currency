import { describe, expect, it } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats a date string correctly', () => {
    expect(formatDate('2026-03-02')).toBe('02 Mar');
  });

  it('handles January', () => {
    expect(formatDate('2026-01-15')).toBe('15 Jan');
  });

  it('handles December', () => {
    expect(formatDate('2026-12-31')).toBe('31 Dec');
  });

  it('handles single-digit day', () => {
    expect(formatDate('2026-07-05')).toBe('05 Jul');
  });
});
