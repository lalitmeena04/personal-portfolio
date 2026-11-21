<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { level } from '../data/profile'

const links = [
  { id: 'profile', label: 'Profile' },
  { id: 'quests', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'trophies', label: 'Trophies' },
  { id: 'freeroam', label: 'Hobbies' },
  { id: 'contact', label: 'Contact' },
]

const progress = ref(0)
const active = ref('')
const open = ref(false)
let raf = 0

function measure() {
  raf = 0
  const max = document.documentElement.scrollHeight - window.innerHeight
  progress.value = max > 0 ? Math.min(1, window.scrollY / max) : 0

  const line = window.innerHeight * 0.35
  let current = ''
  for (const link of links) {
    const section = document.getElementById(link.id)
    if (section && section.getBoundingClientRect().top <= line) current = link.id
  }
  active.value = current
}

function onScroll() {
  if (!raf) raf = requestAnimationFrame(measure)
}

onMounted(() => {
  measure()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <header class="hud" :class="{ 'hud--solid': progress > 0.005 || open }">
    <div class="wrap hud__inner">
      <a class="hud__brand" href="#start" aria-label="Lalit Kumar Meena, back to top">
        <span class="hud__logo" aria-hidden="true">LKM</span>
      </a>
      <div class="hud__level">
        <span class="pixel">LVL {{ level }}</span>
        <div
          class="hud__xp"
          role="progressbar"
          aria-label="Page explored"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress * 100)"
        >
          <span :style="{ transform: `scaleX(${progress})` }"></span>
        </div>
      </div>
      <button class="hud__toggle" type="button" :aria-expanded="open" aria-controls="hud-nav" @click="open = !open">
        {{ open ? 'Close' : 'Menu' }}
      </button>
      <nav id="hud-nav" class="hud__nav" :class="{ 'is-open': open }" aria-label="Sections">
        <a
          v-for="link in links"
          :key="link.id"
          :href="`#${link.id}`"
          :aria-current="active === link.id ? 'true' : undefined"
          @click="open = false"
        >
          {{ link.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.hud {
  position: fixed;
  inset: 0 0 auto;
  z-index: 70;
  height: var(--hud-h);
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.25s,
    border-color 0.25s;
}

.hud--solid {
  background: rgba(9, 11, 16, 0.88);
  border-bottom-color: var(--line);
  backdrop-filter: blur(10px);
}

.hud__inner {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 100%;
}

.hud__brand {
  text-decoration: none;
}

.hud__logo {
  display: grid;
  place-items: center;
  height: 34px;
  padding: 0 9px;
  background: var(--accent);
  color: var(--accent-ink);
  font: 400 0.625rem/1 var(--font-pixel);
}

.hud__level {
  display: grid;
  gap: 5px;
}

.hud__xp {
  width: 96px;
  height: 6px;
  background: var(--line);
  overflow: hidden;
}

.hud__xp span {
  display: block;
  height: 100%;
  background: var(--accent);
  transform-origin: left;
}

.hud__nav {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.hud__nav a {
  padding: 8px 12px;
  color: var(--muted);
  font: 500 0.85rem/1 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: color 0.15s;
}

.hud__nav a:hover {
  color: var(--text);
}

.hud__nav a[aria-current] {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

.hud__toggle {
  display: none;
  margin-left: auto;
  min-height: 38px;
  padding: 0 14px;
  background: none;
  border: 1px solid var(--line-2);
  font: 700 0.8rem/1 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

@media (max-width: 920px) {
  .hud__toggle {
    display: block;
  }

  .hud__nav {
    position: absolute;
    top: var(--hud-h);
    right: 0;
    left: 0;
    display: none;
    flex-direction: column;
    gap: 0;
    margin: 0;
    padding: 8px 20px 16px;
    background: rgba(9, 11, 16, 0.97);
    border-bottom: 1px solid var(--line);
  }

  .hud__nav.is-open {
    display: flex;
  }

  .hud__nav a {
    padding: 14px 4px;
    border-bottom: 1px solid var(--line);
  }
}
</style>
