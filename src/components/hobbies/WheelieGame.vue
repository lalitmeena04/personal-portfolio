<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { unlock } from '../../composables/useAchievements'
import { holdListeners } from '../../utils/hold'

// Degrees and seconds. Tuned so feathering the throttle holds the zone, and pinning it loops the bike in about 2 s.
const LIFT = 160
const DROP = 120
const DRAG = 3
const ZONE = [25, 60]
const LOOP_ANGLE = 80
const TROPHY_SECONDS = 5
const RESET_MS = 900

const angle = ref(0)
const balance = ref(0)
const best = ref(0)
const throttle = ref(false)
const looped = ref(false)
let velocity = 0
let raf = 0
let last = 0
let resetTimer = 0

const inZone = computed(() => angle.value >= ZONE[0] && angle.value <= ZONE[1])
const status = computed(() => (looped.value ? 'Looped out. Resetting.' : inZone.value ? 'In the balance zone.' : ''))
const hold = holdListeners(start, stop)

function step(now: number) {
  const dt = Math.min(0.032, (now - last) / 1000)
  last = now
  velocity += (throttle.value ? LIFT : -DROP) * dt
  velocity *= 1 - DRAG * dt
  angle.value = Math.max(0, angle.value + velocity * dt)

  if (angle.value >= LOOP_ANGLE) {
    loopOut()
    return
  }
  if (inZone.value) {
    balance.value += dt
    best.value = Math.max(best.value, balance.value)
    if (balance.value >= TROPHY_SECONDS) unlock('wheelie')
  } else {
    balance.value = 0
  }
  if (angle.value === 0 && !throttle.value) {
    velocity = 0
    raf = 0
    return
  }
  raf = requestAnimationFrame(step)
}

function loopOut() {
  looped.value = true
  throttle.value = false
  velocity = 0
  raf = 0
  balance.value = 0
  angle.value = LOOP_ANGLE + 30 // tip it past vertical for the crash pose
  resetTimer = setTimeout(() => {
    looped.value = false
    angle.value = 0
  }, RESET_MS)
}

function start() {
  if (throttle.value || looped.value) return
  throttle.value = true
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(step)
  }
}

function stop() {
  throttle.value = false
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(resetTimer)
})
</script>

<template>
  <div
    class="wheelie"
    :class="{
      'is-zone': inZone,
      'is-looped': looped,
      'is-rolling': angle > 0 && !looped,
      'is-trophy': balance >= TROPHY_SECONDS,
    }"
    :style="{
      '--lean': Math.min(1, angle / LOOP_ANGLE),
      '--zone-start': ZONE[0] / LOOP_ANGLE,
      '--zone-end': ZONE[1] / LOOP_ANGLE,
    }"
  >
    <div class="wheelie__stage" aria-hidden="true">
      <svg class="wheelie__bike" viewBox="0 0 200 124" preserveAspectRatio="xMidYMax meet">
        <g :transform="`rotate(${-angle} 70 105)`">
          <g class="wheelie__metal">
            <path d="M70 105 96 101" />
            <path d="M146 105 128 69 119 64" />
          </g>
          <path class="wheelie__engine" d="M92 93h28l-4 15H96z" />
          <path class="wheelie__body" d="M56 75l16 6 20 2 6-10 20-2 16 6-8 14-30 6-20-8z" />
          <circle class="wheelie__lamp" cx="132" cy="79" r="3" />
          <g class="wheelie__rider">
            <path d="M84 81 100 93 93 104" />
            <path d="M84 80 102 60" stroke-width="8" />
            <path d="M102 62 121 66" />
            <circle cx="108" cy="53" r="7.5" />
          </g>
          <g class="wheelie__wheel">
            <circle cx="70" cy="105" r="16" />
            <circle cx="146" cy="105" r="16" />
          </g>
        </g>
      </svg>
      <span class="wheelie__road"></span>
    </div>

    <div class="wheelie__meter" aria-hidden="true">
      <span class="wheelie__zone"></span>
      <span class="wheelie__needle"></span>
    </div>

    <p class="readout wheelie__readout">
      <span
        >Balance <strong>{{ balance.toFixed(1) }}s</strong></span
      >
      <span>Best {{ best.toFixed(1) }}s</span>
    </p>
    <p class="sr-only" aria-live="polite">{{ status }}</p>

    <button type="button" class="btn wheelie__button" v-on="hold">
      {{ looped ? 'Looped it!' : 'Hold to throttle' }}
    </button>
  </div>
</template>

<style scoped>
.wheelie {
  display: grid;
  gap: 12px;
}

.wheelie__stage {
  display: flex;
  flex-direction: column;
  height: 180px;
  overflow: hidden;
  border: 1px solid var(--line-2);
  background: var(--stage);
  transition: border-color 0.15s;
}

.wheelie.is-zone .wheelie__stage {
  border-color: var(--accent);
}

.wheelie.is-looped .wheelie__stage {
  border-color: var(--hp);
}

.wheelie__bike {
  flex: 1;
  width: 100%;
  min-height: 0;
  margin-top: 8px;
}

.wheelie__metal,
.wheelie__rider path,
.wheelie__wheel {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wheelie__metal {
  stroke: var(--muted);
  stroke-width: 4;
}

.wheelie__engine {
  fill: var(--line-2);
}

.wheelie__body {
  fill: var(--accent);
}

.wheelie.is-looped .wheelie__body {
  fill: var(--hp);
}

.wheelie__lamp {
  fill: var(--gold);
}

.wheelie__rider path {
  stroke: var(--text);
  stroke-width: 5;
}

.wheelie__rider circle {
  fill: var(--text);
}

.wheelie__wheel {
  stroke: var(--text);
  stroke-width: 4;
}

.wheelie__road {
  flex: none;
  height: 12px;
  border-top: 2px solid var(--line-2);
  background: repeating-linear-gradient(90deg, var(--line-2) 0 18px, transparent 18px 44px) 0 4px / 44px 2px repeat-x;
}

.wheelie.is-rolling .wheelie__road {
  animation: road 0.3s linear infinite;
}

@keyframes road {
  to {
    background-position-x: -44px;
  }
}

.wheelie__meter {
  position: relative;
  height: 8px;
  background: var(--line);
}

.wheelie__zone {
  position: absolute;
  inset-block: 0;
  left: calc(var(--zone-start) * 100%);
  width: calc((var(--zone-end) - var(--zone-start)) * 100%);
  background: var(--accent);
  opacity: 0.35;
}

.wheelie.is-zone .wheelie__zone {
  opacity: 0.6;
}

.wheelie__needle {
  position: absolute;
  top: -4px;
  bottom: -4px;
  left: calc(var(--lean) * 100%);
  width: 3px;
  margin-left: -1.5px;
  background: var(--text);
}

.wheelie.is-looped .wheelie__needle {
  background: var(--hp);
}

.wheelie__readout {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0;
  font-variant-numeric: tabular-nums;
}

.wheelie__readout strong {
  color: var(--accent);
  font-size: 1.4rem;
}

.wheelie.is-trophy .wheelie__readout strong {
  color: var(--gold);
}

.wheelie__button {
  user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
}

.wheelie.is-looped .wheelie__button {
  border-color: var(--hp);
  color: var(--hp);
}
</style>
