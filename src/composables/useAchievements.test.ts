import { afterEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'lkm:achievements'

/** Loads a fresh copy of the module, as on a page load, with `saved` already in storage. */
async function loadWith(saved?: string) {
  const stored = new Map<string, string>()
  if (saved !== undefined) stored.set(STORAGE_KEY, saved)
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => stored.get(key) ?? null,
    setItem: (key: string, value: string) => stored.set(key, value),
  })
  vi.resetModules()
  const module = await import('./useAchievements')
  return { ...module, saved: () => JSON.parse(stored.get(STORAGE_KEY) ?? 'null') }
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.useRealTimers()
})

describe('achievements', () => {
  it('unlocks once, saves it and shows a single toast', async () => {
    const { unlock, unlocked, toasts, saved } = await loadWith()

    unlock('snake')
    unlock('snake')

    expect([...unlocked]).toEqual(['snake'])
    expect(saved()).toEqual(['snake'])
    expect(toasts.value.map((toast) => toast.title)).toEqual(['Snake Charmer'])
  })

  it('removes the toast after a few seconds', async () => {
    vi.useFakeTimers()
    const { unlock, toasts } = await loadWith()

    unlock('mate')
    vi.advanceTimersByTime(10_000)

    expect(toasts.value).toEqual([])
  })

  it('restores saved progress without announcing it again', async () => {
    const { unlocked, toasts } = await loadWith('["drive","konami"]')

    expect([...unlocked]).toEqual(['drive', 'konami'])
    expect(toasts.value).toEqual([])
  })

  it.each([
    ['an achievement that no longer exists', '["drive","retired"]', ['drive']],
    ['corrupt data', '{not json', []],
    ['data of the wrong shape', '{"drive":true}', []],
  ])('ignores %s in storage', async (_case, stored, expected) => {
    const { unlocked } = await loadWith(stored)

    expect([...unlocked]).toEqual(expected)
  })

  it('resets progress', async () => {
    const { resetAchievements, unlocked, saved } = await loadWith('["drive"]')

    resetAchievements()

    expect(unlocked.size).toBe(0)
    expect(saved()).toEqual([])
  })

  it('still works for the session when storage is unavailable', async () => {
    const { unlock, unlocked } = await loadWith()
    vi.stubGlobal('localStorage', {
      setItem: () => {
        throw new Error('blocked')
      },
    })

    unlock('power')

    expect(unlocked.has('power')).toBe(true)
  })
})
