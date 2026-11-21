import { describe, expect, it } from 'vitest'
import { createCodeMatcher, KONAMI, readGesture, TAP } from './useCheatCode'

const SWIPES = KONAMI.slice(0, 8)

/** Feeds every input and reports whether the last one completed the code. */
function enterAll(inputs: string[], completes = createCodeMatcher()) {
  return inputs.map(completes).at(-1)
}

describe('createCodeMatcher', () => {
  it('completes on the code typed on a keyboard', () => {
    const results = KONAMI.map(createCodeMatcher())

    expect(results.slice(0, -1)).not.toContain(true)
    expect(results.at(-1)).toBe(true)
  })

  it('accepts a tap in place of B and of A', () => {
    expect(enterAll([...SWIPES, TAP, TAP])).toBe(true)
  })

  it('does not accept a tap in place of an arrow', () => {
    expect(enterAll([TAP, ...KONAMI.slice(1)])).toBe(false)
  })

  it('ignores stray inputs before the code', () => {
    expect(enterAll(['ArrowUp', 'x', 'ArrowUp', ...KONAMI])).toBe(true)
  })

  it('rejects the code with an input missing or wrong', () => {
    expect(enterAll([...KONAMI.slice(0, 7), 'b', 'a'])).toBe(false)
    expect(enterAll([...SWIPES, 'a', 'b'])).toBe(false)
  })

  it('needs the whole code again after completing', () => {
    const completes = createCodeMatcher()
    enterAll(KONAMI, completes)

    expect(enterAll(['b', 'a'], completes)).toBe(false)
    expect(enterAll(KONAMI, completes)).toBe(true)
  })
})

describe('readGesture', () => {
  it('reads a touch that barely moved as a tap', () => {
    expect(readGesture(0, 0)).toBe(TAP)
    expect(readGesture(6, -8)).toBe(TAP)
  })

  it('reads a swipe by its dominant direction', () => {
    expect(readGesture(0, -120)).toBe('ArrowUp')
    expect(readGesture(10, 90)).toBe('ArrowDown')
    expect(readGesture(-80, 20)).toBe('ArrowLeft')
    expect(readGesture(200, -40)).toBe('ArrowRight')
  })

  it('ignores a drag that is too short or too diagonal to call', () => {
    expect(readGesture(25, 0)).toBeNull()
    expect(readGesture(90, 70)).toBeNull()
  })
})
