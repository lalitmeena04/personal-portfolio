<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { unlock } from '../../composables/useAchievements'

const LIGHTS = 5
const LIGHT_MS = 550
const HOLD_MS = [900, 2600]
// Nobody reacts faster than this, so it was a guess. Same rule as a real race start.
const FALSE_START_MS = 100
const TROPHY_MS = 350

type Phase = 'idle' | 'lights' | 'go' | 'done' | 'jump'

const LABELS: Record<Phase, string> = {
  idle: 'Start the lights',
  lights: 'Wait for it…',
  go: 'Go!',
  done: 'Race again',
  jump: 'Jump start! Retry',
}

const phase = ref<Phase>('idle')
const lit = ref(0)
const reaction = ref<number | null>(null)
const best = ref<number | null>(null)
let timer = 0
let goAt = 0

const seconds = (ms: number) => `${(ms / 1000).toFixed(3)}s`
const status = computed(() => {
  if (phase.value === 'go') return 'Go!'
  if (phase.value === 'jump') return 'Jump start.'
  if (phase.value === 'done' && reaction.value != null) return `Reaction time ${seconds(reaction.value)}.`
  return ''
})

function begin() {
  phase.value = 'lights'
  lit.value = 0
  reaction.value = null
  timer = setTimeout(addLight, LIGHT_MS)
}

function addLight() {
  lit.value++
  if (lit.value < LIGHTS) {
    timer = setTimeout(addLight, LIGHT_MS)
  } else {
    // A random hold, so the start cannot be timed from the rhythm of the lights.
    timer = setTimeout(lightsOut, HOLD_MS[0] + Math.random() * (HOLD_MS[1] - HOLD_MS[0]))
  }
}

function lightsOut() {
  lit.value = 0
  phase.value = 'go'
  goAt = performance.now()
}

function jumpStart() {
  clearTimeout(timer)
  lit.value = 0
  phase.value = 'jump'
}

function press() {
  if (phase.value === 'lights') {
    // Ignore a double-press on the start button; it only counts once a light is on.
    if (lit.value > 0) jumpStart()
    return
  }
  if (phase.value !== 'go') {
    begin()
    return
  }
  const ms = performance.now() - goAt
  if (ms < FALSE_START_MS) {
    jumpStart()
    return
  }
  reaction.value = ms
  best.value = best.value == null ? ms : Math.min(best.value, ms)
  phase.value = 'done'
  if (ms <= TROPHY_MS) unlock('launch')
}

// React on press rather than release: a click only fires on the way up, which would add to the time.
function onKeydown(event: KeyboardEvent) {
  if (event.key !== ' ' && event.key !== 'Enter') return
  event.preventDefault()
  if (!event.repeat) press()
}

// Pointer and keyboard presses are handled above; this catches clicks synthesised by assistive tech.
function onClick(event: MouseEvent) {
  if (event.detail === 0) press()
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="lights" :class="[`is-${phase}`, { 'is-trophy': reaction != null && reaction <= TROPHY_MS }]">
    <ol class="lights__gantry" aria-hidden="true">
      <li v-for="n in LIGHTS" :key="n" class="lights__lamp" :class="{ 'is-on': n <= lit }"></li>
    </ol>
    <p class="readout lights__readout">
      <span
        >Reaction
        <strong>{{ phase === 'jump' ? 'Jump start' : reaction == null ? '–' : seconds(reaction) }}</strong></span
      >
      <span>Best {{ best == null ? '–' : seconds(best) }}</span>
    </p>
    <p class="sr-only" aria-live="assertive">{{ status }}</p>
    <button
      type="button"
      class="btn lights__button"
      @pointerdown="press"
      @keydown="onKeydown"
      @click="onClick"
      @contextmenu.prevent
    >
      {{ LABELS[phase] }}
    </button>
  </div>
</template>

<style scoped>
.lights {
  display: grid;
  gap: 12px;
}

.lights__gantry {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: clamp(6px, 2.5%, 14px);
  height: 180px;
  padding: 0 12px;
  border: 1px solid var(--line-2);
  background: var(--stage);
  transition: border-color 0.15s;
}

.lights.is-go .lights__gantry {
  border-color: var(--accent);
}

.lights.is-jump .lights__gantry {
  border-color: var(--hp);
}

.lights__lamp {
  flex: 0 1 52px;
  aspect-ratio: 1;
  border: 3px solid var(--line-2);
  border-radius: 50%;
  background: #1c1014;
}

.lights__lamp.is-on {
  border-color: #ff9aa8;
  background: var(--hp);
  box-shadow: 0 0 22px var(--hp);
}

.lights__readout {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.lights__readout strong {
  color: var(--accent);
  font-size: 1.4rem;
}

.lights.is-jump .lights__readout strong {
  color: var(--hp);
}

.lights.is-trophy .lights__readout strong {
  color: var(--gold);
}

.lights__button {
  user-select: none;
  touch-action: manipulation;
  -webkit-touch-callout: none;
}

.lights.is-go .lights__button {
  border-color: var(--accent);
  color: var(--accent);
}

.lights.is-jump .lights__button {
  border-color: var(--hp);
  color: var(--hp);
}
</style>
