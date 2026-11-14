let observer

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  )
  return observer
}

// v-reveal fades an element in the first time it scrolls into view. Optional value: delay in ms.
export const reveal = {
  mounted(el, { value }) {
    el.classList.add('reveal')
    if (value) el.style.transitionDelay = `${value}ms`
    getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}
