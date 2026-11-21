<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { unlock } from '../../composables/useAchievements'
import { holdListeners } from '../../utils/hold'

const TARGET = 9000
const SECONDS_TO_TARGET = 3.4
const MAX_SECONDS = 4.2

const power = ref(0)
const charging = ref(false)
let held = 0 // seconds of charge currently banked
let raf = 0
let last = 0

const over = computed(() => power.value > TARGET)
const ratio = computed(() => Math.min(1, power.value / TARGET))
const hold = holdListeners(start, stop)

function step(now: number) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  held = charging.value ? Math.min(MAX_SECONDS, held + dt) : Math.max(0, held - dt * 3)
  power.value = Math.round((TARGET + 1) * (held / SECONDS_TO_TARGET) ** 2)
  if (over.value) unlock('power')
  raf = charging.value || held > 0 ? requestAnimationFrame(step) : 0
}

function start() {
  if (charging.value) return
  charging.value = true
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(step)
  }
}

function stop() {
  charging.value = false
}

onBeforeUnmount(() => cancelAnimationFrame(raf))
</script>

<template>
  <div class="power" :class="{ 'is-over': over, 'is-charging': charging }" :style="{ '--p': ratio }">
    <div class="power__stage" aria-hidden="true">
      <span class="power__lines"></span>
      <span class="power__aura"></span>
      <span class="power__core"></span>
    </div>
    <p class="readout power__readout">
      <span>Power level</span>
      <output>{{ power.toLocaleString('en') }}</output>
    </p>
    <button type="button" class="btn power__button" v-on="hold">
      {{ over ? "It's over 9000!" : 'Hold to power up' }}
    </button>
  </div>
</template>

<style scoped>
.power {
  --p: 0;
  --glow: var(--mp);
  display: grid;
  gap: 12px;
}

.power.is-over {
  --glow: var(--gold);
}

.power__stage {
  position: relative;
  display: grid;
  place-items: center;
  height: 150px;
  overflow: hidden;
  border: 1px solid var(--line-2);
  background: var(--stage);
}

.power__aura,
.power__core {
  grid-area: 1 / 1;
}

/* Out of flow so its size cannot stretch the stage's grid row. */
.power__lines {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  aspect-ratio: 1;
  translate: -50% -50%;
  background: repeating-conic-gradient(from 0deg, var(--glow) 0 1.2deg, transparent 1.2deg 9deg);
  mask-image: radial-gradient(circle, transparent 18%, #000 60%);
  opacity: calc(var(--p) * 0.5);
}

.power.is-charging .power__lines {
  animation: spin 1.4s linear infinite;
}

.power__aura {
  width: 120px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(circle, var(--glow), transparent 68%);
  opacity: calc(0.15 + var(--p) * 0.7);
  transform: scale(calc(0.5 + var(--p) * 1.1));
}

.power__core {
  width: 26px;
  aspect-ratio: 1;
  background: var(--text);
  transform: rotate(45deg) scale(calc(1 + var(--p) * 0.5));
  box-shadow: 0 0 calc(var(--p) * 30px) var(--glow);
}

.power.is-over .power__core {
  animation: shake 0.12s linear infinite;
}

@keyframes spin {
  to {
    rotate: 1turn;
  }
}

@keyframes shake {
  50% {
    translate: 2px -1px;
  }
}

.power__readout {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0;
}

.power__readout output {
  color: var(--glow);
  font: 400 1rem/1.4 var(--font-pixel);
  font-variant-numeric: tabular-nums;
}

.power__button {
  user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
}

.power.is-over .power__button {
  border-color: var(--gold);
  color: var(--gold);
}
</style>
