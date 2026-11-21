import { afterEach, describe, expect, it, vi } from 'vitest'
import { formatDuration, monthsInclusive } from './dates'

describe('monthsInclusive', () => {
  afterEach(() => vi.useRealTimers())

  it('counts both the first and the last month', () => {
    expect(monthsInclusive('2021-10', '2021-10')).toBe(1)
    expect(monthsInclusive('2021-10', '2025-02')).toBe(41)
  })

  it('counts up to the current month when there is no end', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 10, 15))

    expect(monthsInclusive('2026-09')).toBe(3)
    expect(monthsInclusive('2026-09', null)).toBe(3)
  })
})

describe('formatDuration', () => {
  it.each([
    [0, ''],
    [1, '1 mo'],
    [11, '11 mos'],
    [12, '1 yr'],
    [13, '1 yr 1 mo'],
    [41, '3 yrs 5 mos'],
  ])('formats %i months as "%s"', (months, expected) => {
    expect(formatDuration(months)).toBe(expected)
  })
})
