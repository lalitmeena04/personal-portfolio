<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { unlock } from '../../composables/useAchievements'

const COLS = 20
const ROWS = 12
const CELL = 24
const PAD = 6 // room for the wall around the field
const W = COLS * CELL + PAD * 2
const H = ROWS * CELL + PAD * 2
// The two-tone LCD palette of the Nokia original.
const LCD = '#c7f0d8'
const INK = '#43523d'

const START_MS = 150
const MIN_MS = 70
const SPEEDUP_MS = 4 // faster per food eaten
const SWIPE_PX = 22
const TROPHY_SCORE = 10
const BEST_KEY = 'lkm:snake-best'

type Direction = 'up' | 'down' | 'left' | 'right'
type State = 'idle' | 'playing' | 'paused' | 'over'

interface Cell {
  x: number
  y: number
}

const STEPS: Record<Direction, [dx: number, dy: number]> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }
const OPPOSITE: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' }
const KEYS: Record<string, Direction> = {
  arrowup: 'up',
  w: 'up',
  arrowdown: 'down',
  s: 'down',
  arrowleft: 'left',
  a: 'left',
  arrowright: 'right',
  d: 'right',
}

const canvas = ref<HTMLCanvasElement | null>(null)
const state = ref<State>('idle')
const score = ref(0)
const best = ref(readBest())

// Shown over the screen in every state except while playing.
const overlay = computed(() => {
  const overlays: Partial<Record<State, { title: string; hint: string }>> = {
    idle: { title: 'Snake', hint: 'Press Enter or tap to start' },
    paused: { title: 'Paused', hint: 'Press Enter or tap to resume' },
    over: { title: 'Game over', hint: `Score ${score.value}. Press Enter or tap to retry` },
  }
  return overlays[state.value]
})

let ctx: CanvasRenderingContext2D | null = null
let raf = 0
let last = 0
let elapsed = 0
let snake: Cell[] = []
let heading: Direction = 'right'
let turns: Direction[] = []
let food: Cell | null = null
let swipeFrom: Cell | null = null
let observer: IntersectionObserver | undefined

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0
  } catch {
    return 0
  }
}

const same = (a: Cell, b: Cell) => a.x === b.x && a.y === b.y

function placeFood() {
  const free: Cell[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!snake.some((part) => part.x === x && part.y === y)) free.push({ x, y })
    }
  }
  food = free.length ? free[Math.floor(Math.random() * free.length)] : null
}

function start() {
  const y = Math.floor(ROWS / 2)
  snake = [5, 4, 3].map((x) => ({ x, y }))
  heading = 'right'
  turns = []
  score.value = 0
  placeFood()
  resume()
}

function resume() {
  state.value = 'playing'
  last = performance.now()
  elapsed = 0
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(tick)
}

function pause() {
  if (state.value !== 'playing') return
  state.value = 'paused'
  cancelAnimationFrame(raf)
}

function end() {
  state.value = 'over'
  if (score.value <= best.value) return
  best.value = score.value
  try {
    localStorage.setItem(BEST_KEY, String(best.value))
  } catch {
    // Best score is session-only when storage is unavailable.
  }
}

// Turns are queued so two quick presses within one step both register.
function turn(direction: Direction) {
  if (state.value !== 'playing' || turns.length >= 2) return
  const current = turns.at(-1) ?? heading
  if (direction !== current && direction !== OPPOSITE[current]) turns.push(direction)
}

function step() {
  heading = turns.shift() ?? heading
  const [dx, dy] = STEPS[heading]
  const head = { x: snake[0].x + dx, y: snake[0].y + dy }
  const eating = food && same(head, food)
  // The tail moves out of the way this step unless the snake is growing.
  const body = eating ? snake : snake.slice(0, -1)
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || body.some((part) => same(part, head))) {
    end()
    return
  }
  snake.unshift(head)
  if (!eating) {
    snake.pop()
    return
  }
  score.value++
  if (score.value === TROPHY_SCORE) unlock('snake')
  placeFood()
  if (!food) end()
}

function draw() {
  if (!ctx) return
  ctx.fillStyle = LCD
  ctx.fillRect(0, 0, W, H)
  ctx.strokeStyle = INK
  ctx.lineWidth = 3
  ctx.strokeRect(2.5, 2.5, W - 5, H - 5)

  ctx.fillStyle = INK
  for (const [i, part] of snake.entries()) {
    const inset = i === 0 ? 1 : 3
    ctx.fillRect(PAD + part.x * CELL + inset, PAD + part.y * CELL + inset, CELL - inset * 2, CELL - inset * 2)
  }
  if (!food) return
  // Food is the original's little plus sign: four dots around an empty centre.
  const third = CELL / 3
  for (const [cx, cy] of [
    [1, 0],
    [0, 1],
    [2, 1],
    [1, 2],
  ]) {
    ctx.fillRect(PAD + food.x * CELL + cx * third + 1, PAD + food.y * CELL + cy * third + 1, third - 2, third - 2)
  }
}

function tick(now: number) {
  const interval = Math.max(MIN_MS, START_MS - score.value * SPEEDUP_MS)
  elapsed = Math.min(elapsed + now - last, interval * 2)
  last = now
  while (elapsed >= interval && state.value === 'playing') {
    step()
    elapsed -= interval
  }
  draw()
  if (state.value === 'playing') raf = requestAnimationFrame(tick)
}

function toggle() {
  if (state.value === 'playing') pause()
  else if (state.value === 'paused') resume()
  else start()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    toggle()
    return
  }
  const direction = KEYS[event.key.toLowerCase()]
  // Only capture the arrow keys mid-game, so they still scroll the page otherwise.
  if (!direction || state.value !== 'playing') return
  event.preventDefault()
  turn(direction)
}

function onPointerDown(event: PointerEvent) {
  canvas.value?.focus({ preventScroll: true })
  if (state.value !== 'playing') {
    toggle()
    return
  }
  swipeFrom = { x: event.clientX, y: event.clientY }
}

function onPointerMove(event: PointerEvent) {
  if (!swipeFrom) return
  const dx = event.clientX - swipeFrom.x
  const dy = event.clientY - swipeFrom.y
  if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return
  turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
  swipeFrom = { x: event.clientX, y: event.clientY }
}

function onHidden() {
  if (document.hidden) pause()
}

onMounted(() => {
  const screen = canvas.value
  if (!screen) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  screen.width = W * dpr
  screen.height = H * dpr
  ctx = screen.getContext('2d')
  ctx?.setTransform(dpr, 0, 0, dpr, 0, 0)
  draw()

  // Pause when the game scrolls out of view or the tab is hidden.
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) pause()
  })
  observer.observe(screen)
  document.addEventListener('visibilitychange', onHidden)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  observer?.disconnect()
  document.removeEventListener('visibilitychange', onHidden)
})
</script>

<template>
  <div class="snake">
    <div class="snake__lcd">
      <canvas
        ref="canvas"
        class="snake__screen"
        :class="{ 'is-playing': state === 'playing' }"
        tabindex="0"
        role="application"
        aria-label="Snake. Press Enter to start or pause. Steer with the arrow keys, W A S D, or by swiping."
        @keydown="onKeydown"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="swipeFrom = null"
        @pointercancel="swipeFrom = null"
      ></canvas>
      <div v-if="overlay" class="snake__overlay" aria-hidden="true">
        <strong>{{ overlay.title }}</strong>
        <span>{{ overlay.hint }}</span>
      </div>
    </div>
    <p class="readout snake__help">
      <span>Arrow keys, WASD or swipe</span>
      <span>Space to pause</span>
      <span aria-live="polite">Score {{ score }} · Best {{ best }}</span>
    </p>
  </div>
</template>

<style scoped>
.snake__lcd {
  position: relative;
  border: 1px solid var(--line-2);
}

.snake__screen {
  display: block;
  width: 100%;
  aspect-ratio: 492 / 300;
  cursor: pointer;
  touch-action: pan-y;
}

/* While a game is running, swipes steer the snake instead of scrolling the page. */
.snake__screen.is-playing {
  touch-action: none;
}

.snake__screen:focus-visible {
  outline-offset: 2px;
}

.snake__overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(199, 240, 216, 0.84);
  color: #43523d;
  font-family: var(--font-pixel);
  text-align: center;
  text-transform: uppercase;
  pointer-events: none;
}

.snake__overlay strong {
  font-size: clamp(1rem, 4.4vw, 1.5rem);
  font-weight: 400;
}

.snake__overlay span {
  font-size: clamp(0.5rem, 1.9vw, 0.62rem);
  line-height: 1.8;
}

.snake__help {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin: 12px 0 0;
}

.snake__help span:last-child {
  margin-left: auto;
  color: var(--text);
}
</style>
