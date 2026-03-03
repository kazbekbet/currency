import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { relativeTime } from './time';

describe('relativeTime', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'только что' for < 10 seconds ago", () => {
    const ts = Date.now() - 5_000;
    expect(relativeTime(ts)).toBe('только что');
  });

  it('returns seconds ago for 10-59 seconds', () => {
    const ts = Date.now() - 30_000;
    expect(relativeTime(ts)).toBe('30 сек. назад');
  });

  it('returns minutes ago', () => {
    const ts = Date.now() - 5 * 60_000;
    expect(relativeTime(ts)).toBe('5 мин. назад');
  });

  it('returns hours ago', () => {
    const ts = Date.now() - 3 * 3_600_000;
    expect(relativeTime(ts)).toBe('3 ч. назад');
  });

  it('returns days ago', () => {
    const ts = Date.now() - 2 * 86_400_000;
    expect(relativeTime(ts)).toBe('2 д. назад');
  });
});
