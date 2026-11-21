import { onBeforeUnmount, onMounted } from 'vue'

export const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]
/** On touch screens the arrows are swipes, and a tap stands in for B and for A. */
export const TAP = 'tap'

const SWIPE_MIN_PX = 40
const TAP_MAX_PX = 10

/**
 * Returns a function to feed inputs to (key names, or TAP). It returns true when the latest inputs complete the
 * code. Only the last ten are compared, so a stray swipe or key before the code (scrolling, say) does not spoil it.
 */
export function createCodeMatcher() {
  const recent: string[] = []
  return (input: string) => {
    recent.push(input)
    if (recent.length > KONAMI.length) recent.shift()
    if (recent.length < KONAMI.length) return false
    if (!KONAMI.every((key, i) => recent[i] === key || (recent[i] === TAP && key.length === 1))) return false
    recent.length = 0
    return true
  }
}

/** Reads a finished touch as an input from how far it moved, or null if it is ambiguous (a short drag, a diagonal). */
export function readGesture(dx: number, dy: number): string | null {
  const across = Math.abs(dx)
  const along = Math.abs(dy)
  const longer = Math.max(across, along)
  if (longer <= TAP_MAX_PX) return TAP
  if (longer < SWIPE_MIN_PX || longer < 2 * Math.min(across, along)) return null
  if (across > along) return dx > 0 ? 'ArrowRight' : 'ArrowLeft'
  return dy > 0 ? 'ArrowDown' : 'ArrowUp'
}

/** Calls `onEntered` each time the Konami code is entered anywhere on the page, by keyboard or by touch. */
export function useCheatCode(onEntered: () => void) {
  const completes = createCodeMatcher()
  let touchFrom: { x: number; y: number } | null = null

  function enter(input: string) {
    if (completes(input)) onEntered()
  }

  function onKeydown(event: KeyboardEvent) {
    enter(event.key.length === 1 ? event.key.toLowerCase() : event.key)
  }

  // Touch events rather than pointer events: the browser cancels pointer events once a swipe starts scrolling the page.
  function onTouchStart(event: TouchEvent) {
    const [touch] = event.touches
    touchFrom = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
  }

  function onTouchEnd(event: TouchEvent) {
    if (!touchFrom || event.touches.length) return
    const [touch] = event.changedTouches
    const input = readGesture(touch.clientX - touchFrom.x, touch.clientY - touchFrom.y)
    touchFrom = null
    if (input) enter(input)
  }

  function onTouchCancel() {
    touchFrom = null
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchCancel, { passive: true })
  })

  onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeydown)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchend', onTouchEnd)
    window.removeEventListener('touchcancel', onTouchCancel)
  })
}
