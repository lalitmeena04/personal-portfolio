<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import { Chess } from 'chess.js'
import { unlock } from '../../composables/useAchievements'

// White to move and mate in one. Each position has exactly one mating move.
const PUZZLES = [
  '6k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
  '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1',
  'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4',
]
const FILES = 'abcdefgh'
// Solid glyphs for both sides (colour comes from CSS); U+FE0E keeps the pawn from rendering as an emoji.
const GLYPHS = { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' }
const NAMES = { k: 'king', q: 'queen', r: 'rook', b: 'bishop', n: 'knight', p: 'pawn' }
const MISS_MS = 1100

const game = new Chess(PUZZLES[0])
const index = ref(0)
const board = ref(game.board())
const selected = ref(null)
const targets = ref([])
const status = ref('play') // play | miss | solved
let missTimer = 0

const squares = computed(() =>
  board.value.flatMap((rank, r) =>
    rank.map((piece, f) => {
      const name = `${FILES[f]}${8 - r}`
      return {
        name,
        piece,
        dark: (r + f) % 2 === 1,
        label: piece ? `${name}, ${piece.color === 'w' ? 'white' : 'black'} ${NAMES[piece.type]}` : `${name}, empty`,
      }
    }),
  ),
)

const message = computed(() => {
  if (status.value === 'solved') return 'Checkmate. Nicely done.'
  if (status.value === 'miss') return 'Legal, but not mate. Taking it back…'
  return 'White to move. Mate in one.'
})

function clearSelection() {
  selected.value = null
  targets.value = []
}

function load(i) {
  clearTimeout(missTimer)
  index.value = i
  game.load(PUZZLES[i])
  board.value = game.board()
  status.value = 'play'
  clearSelection()
}

function press(square) {
  if (status.value !== 'play') return

  if (selected.value && targets.value.includes(square.name)) {
    game.move({ from: selected.value, to: square.name, promotion: 'q' })
    board.value = game.board()
    clearSelection()
    if (game.isCheckmate()) {
      status.value = 'solved'
      unlock('mate')
      return
    }
    status.value = 'miss'
    missTimer = setTimeout(() => {
      game.undo()
      board.value = game.board()
      status.value = 'play'
    }, MISS_MS)
    return
  }

  if (square.piece?.color === 'w' && square.name !== selected.value) {
    selected.value = square.name
    targets.value = game.moves({ square: square.name, verbose: true }).map((move) => move.to)
  } else {
    clearSelection()
  }
}

onBeforeUnmount(() => clearTimeout(missTimer))
</script>

<template>
  <div class="chess">
    <div class="chess__board" :class="`is-${status}`">
      <button
        v-for="square in squares"
        :key="square.name"
        type="button"
        class="chess__square"
        :class="{
          'is-dark': square.dark,
          'is-selected': square.name === selected,
          'is-target': targets.includes(square.name),
        }"
        :aria-label="square.label"
        :aria-pressed="square.name === selected"
        @click="press(square)"
      >
        <span v-if="square.piece" :class="`chess__piece chess__piece--${square.piece.color}`" aria-hidden="true">
          {{ GLYPHS[square.piece.type] }}&#xFE0E;
        </span>
      </button>
    </div>
    <div class="chess__bar">
      <p aria-live="polite">
        <span>Puzzle {{ index + 1 }} / {{ PUZZLES.length }}</span>
        {{ message }}
      </p>
      <button v-if="status === 'solved'" type="button" class="btn btn--sm btn--primary" @click="load((index + 1) % PUZZLES.length)">
        Next puzzle
      </button>
      <button v-else type="button" class="btn btn--sm" @click="load(index)">Reset</button>
    </div>
  </div>
</template>

<style scoped>
.chess__board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  width: min(100%, 360px);
  aspect-ratio: 1;
  margin-inline: auto;
  border: 3px solid var(--line-2);
}

.chess__board.is-solved {
  border-color: var(--accent);
}

.chess__board.is-miss {
  border-color: var(--hp);
}

.chess__square {
  position: relative;
  display: grid;
  place-items: center;
  min-width: 0;
  padding: 0;
  background: #93a0b8;
  border: 0;
  cursor: pointer;
  container-type: size;
}

.chess__square.is-dark {
  background: #586580;
}

.chess__square.is-selected {
  box-shadow: inset 0 0 0 3px var(--accent);
}

.chess__square.is-target::after {
  content: '';
  position: absolute;
  width: 30%;
  height: 30%;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 2px rgba(9, 11, 16, 0.5);
}

.chess__square:focus-visible {
  z-index: 1;
  outline-offset: -3px;
  outline-color: var(--text);
}

.chess__piece {
  font-size: 78cqh;
  line-height: 1;
  font-family: 'Segoe UI Symbol', 'Noto Sans Symbols 2', 'DejaVu Sans', sans-serif;
}

.chess__piece--w {
  color: #fff;
  text-shadow:
    0 1px 0 #1b2030,
    1px 0 0 #1b2030,
    -1px 0 0 #1b2030,
    0 -1px 0 #1b2030;
}

.chess__piece--b {
  color: #0d0f15;
}

.chess__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-top: 14px;
}

.chess__bar p {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
}

.chess__bar p span {
  display: block;
  color: var(--muted);
  font: 500 0.76rem/1.6 var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
</style>
