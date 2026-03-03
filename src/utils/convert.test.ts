import { describe, expect, it } from 'vitest';
import { convert, formatAmount } from './convert';
import type { Rates } from '../types';

const mockRates: Rates = {
  base: 'USD',
  date: '2026-03-01',
  values: { USD: 1, EUR: 0.92, RUB: 90.5, THB: 35.2 },
};

describe('convert', () => {
  it('same currency returns original amount', () => {
    expect(convert(100, 'USD', 'USD', mockRates)).toBe(100);
  });

  it('USD → RUB', () => {
    expect(convert(1, 'USD', 'RUB', mockRates)).toBeCloseTo(90.5);
  });

  it('RUB → USD', () => {
    expect(convert(90.5, 'RUB', 'USD', mockRates)).toBeCloseTo(1);
  });

  it('EUR → RUB cross-rate', () => {
    // 1 EUR = (1/0.92) * 90.5 RUB ≈ 98.37
    const result = convert(1, 'EUR', 'RUB', mockRates);
    expect(result).toBeCloseTo(98.37, 1);
  });

  it('zero amount returns zero', () => {
    expect(convert(0, 'USD', 'RUB', mockRates)).toBe(0);
  });

  it('large amount scales linearly', () => {
    const single = convert(1, 'USD', 'THB', mockRates);
    const hundred = convert(100, 'USD', 'THB', mockRates);
    expect(hundred).toBeCloseTo(single * 100, 5);
  });
});

describe('formatAmount', () => {
  it('rounds to 2 decimals by default', () => {
    expect(formatAmount(1.23456)).toBe('1.23');
  });

  it('custom decimals', () => {
    expect(formatAmount(1.23456, 4)).toBe('1.2346');
  });

  it('strips trailing zeros', () => {
    expect(formatAmount(1.5, 4)).toBe('1.5');
  });

  it('whole number shows no decimals', () => {
    expect(formatAmount(100)).toBe('100');
  });

  it("zero returns '0'", () => {
    expect(formatAmount(0)).toBe('0');
  });
});
