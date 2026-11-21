/**
 * Listeners for a press-and-hold button, for `v-on="holdListeners(start, stop)"`. Holding works with a mouse,
 * a finger, or the Space and Enter keys, and stops when the pointer leaves or the button loses focus.
 */
export function holdListeners(start: () => void, stop: () => void) {
  return {
    pointerdown: () => start(),
    pointerup: () => stop(),
    pointerleave: () => stop(),
    pointercancel: () => stop(),
    keydown(event: KeyboardEvent) {
      if (event.repeat || (event.key !== ' ' && event.key !== 'Enter')) return
      event.preventDefault()
      start()
    },
    keyup: () => stop(),
    blur: () => stop(),
    // A long press on a touch screen would otherwise open the context menu.
    contextmenu: (event: Event) => event.preventDefault(),
  }
}
