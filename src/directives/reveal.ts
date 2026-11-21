import type { ObjectDirective } from 'vue'

let observer: IntersectionObserver | undefined

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries, self) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        self.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

// v-reveal fades an element in the first time it scrolls into view. Optional value: delay in ms.
export const reveal: ObjectDirective<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    el.classList.add('reveal')
    if (value) el.style.transitionDelay = `${value}ms`
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

// Lets templates type-check `v-reveal`, which main.ts registers globally.
declare module 'vue' {
  interface GlobalDirectives {
    vReveal: typeof reveal
  }
}
