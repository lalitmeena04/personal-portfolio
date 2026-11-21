<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { unlock } from '../../composables/useAchievements'

const SIZE = 64
const GRAVITY = 1500
const KICK = -580
const TROPHY_TOUCHES = 10

const pitch = ref<HTMLElement | null>(null)
const ball = ref<HTMLElement | null>(null)
const touches = ref(0)
const best = ref(0)
const pos = reactive({ x: 0, y: 0, spin: 0 })

let width = 0
let height = 0
let vx = 0
let vy = 0
let raf = 0
let last = 0
let resizeObserver: ResizeObserver | undefined

function rest() {
  if (!pitch.value) return
  width = pitch.value.clientWidth
  height = pitch.value.clientHeight
  pos.x = Math.min(Math.max(0, pos.x || (width - SIZE) / 2), width - SIZE)
  pos.y = height - SIZE
}

function kick(event?: PointerEvent) {
  if (!ball.value) return
  const rect = ball.value.getBoundingClientRect()
  // Hitting the ball off-centre sends it the other way, like a real touch.
  const offset = event?.clientX != null ? rect.left + rect.width / 2 - event.clientX : (Math.random() - 0.5) * 24
  vx = Math.max(-320, Math.min(320, vx + offset * 9))
  vy = KICK
  touches.value++
  best.value = Math.max(best.value, touches.value)
  if (touches.value === TROPHY_TOUCHES) unlock('juggle')
  if (!raf) {
    last = performance.now()
    raf = requestAnimationFrame(step)
  }
}

function step(now: number) {
  const dt = Math.min(0.032, (now - last) / 1000)
  last = now
  vy += GRAVITY * dt
  pos.x += vx * dt
  pos.y += vy * dt
  pos.spin += vx * dt * 1.6

  if (pos.x <= 0 || pos.x >= width - SIZE) {
    pos.x = Math.min(Math.max(0, pos.x), width - SIZE)
    vx = -vx * 0.8
  }
  if (pos.y <= 0) {
    pos.y = 0
    vy = Math.abs(vy) * 0.6
  }
  if (pos.y >= height - SIZE) {
    pos.y = height - SIZE
    touches.value = 0
    if (Math.abs(vy) < 140) {
      vx = 0
      vy = 0
      raf = 0
      return
    }
    vy = -vy * 0.45
    vx *= 0.7
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  const el = pitch.value
  if (!el) return
  rest()
  resizeObserver = new ResizeObserver(() => {
    if (!raf) rest()
    else width = el.clientWidth
  })
  resizeObserver.observe(el)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  cancelAnimationFrame(raf)
})
</script>

<template>
  <div class="keepy">
    <div ref="pitch" class="keepy__pitch">
      <button
        ref="ball"
        type="button"
        class="keepy__ball"
        aria-label="Kick the ball"
        :style="{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }"
        @pointerdown.prevent="kick($event)"
        @keydown.enter.prevent="kick()"
        @keydown.space.prevent="kick()"
      >
        <span aria-hidden="true" :style="{ transform: `rotate(${pos.spin}deg)` }">⚽</span>
      </button>
    </div>
    <p class="readout keepy__score" aria-live="polite">
      Touches <strong>{{ touches }}</strong> <span>Best {{ best }}</span>
    </p>
  </div>
</template>

<style scoped>
.keepy__pitch {
  position: relative;
  height: 230px;
  overflow: hidden;
  border: 1px solid var(--line-2);
  background:
    linear-gradient(transparent calc(100% - 3px), #3d8b4f calc(100% - 3px)),
    repeating-linear-gradient(90deg, rgba(61, 139, 79, 0.1) 0 40px, rgba(61, 139, 79, 0.04) 40px 80px);
  touch-action: manipulation;
}

.keepy__ball {
  position: absolute;
  top: 0;
  left: 0;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  padding: 0;
  background: none;
  border: 0;
  border-radius: 50%;
  font-size: 44px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  touch-action: none;
}

.keepy__ball span {
  display: block;
}

.keepy__score {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 12px 0 0;
}

.keepy__score strong {
  color: var(--accent);
  font-size: 1.4rem;
}

.keepy__score span {
  margin-left: auto;
}
</style>
