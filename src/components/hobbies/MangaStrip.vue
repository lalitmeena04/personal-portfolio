<script setup>
import { ref } from 'vue'
import { unlock } from '../../composables/useAchievements'

// A four-panel strip (yonkoma), laid out and read right to left.
const panels = [
  { mood: 'calm', caption: '2:07 AM', face: '(^_^)', line: 'One last build before bed.' },
  { mood: 'impact', sfx: 'ドン!!', face: '(O_O)', line: 'Segfault. Core dumped.' },
  { mood: 'focus', face: '(•_•)', line: 'A dangling pointer. So this was your true form.' },
  { mood: 'end', caption: 'つづく', face: '(-_-;)', line: 'Fixed. Wait, why are there two new warnings?' },
]

const read = ref(0)

function next() {
  if (read.value >= panels.length) {
    read.value = 0
    return
  }
  read.value++
  if (read.value === panels.length) unlock('manga')
}
</script>

<template>
  <div class="manga">
    <ol class="manga__page" dir="rtl">
      <li
        v-for="(panel, i) in panels"
        :key="panel.line"
        dir="ltr"
        class="koma"
        :class="[`koma--${panel.mood}`, { 'is-read': i < read }]"
      >
        <template v-if="i < read">
          <span v-if="panel.caption" class="koma__caption">{{ panel.caption }}</span>
          <span v-if="panel.sfx" class="koma__sfx" aria-hidden="true">{{ panel.sfx }}</span>
          <span class="koma__face" aria-hidden="true">{{ panel.face }}</span>
          <p class="koma__bubble">{{ panel.line }}</p>
        </template>
        <span v-else class="koma__number" aria-label="Unread panel">{{ i + 1 }}</span>
      </li>
    </ol>
    <div class="manga__controls">
      <button type="button" class="btn btn--sm" @click="next">
        {{ read === 0 ? 'Start reading' : read < panels.length ? 'Next panel' : 'Read again' }}
      </button>
      <span><span aria-hidden="true">←</span> Read right to left</span>
    </div>
  </div>
</template>

<style scoped>
.manga {
  --paper: #f2efe6;
  --ink: #14151a;
}

.manga__page {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  padding: 6px;
  background: var(--paper);
}

.koma {
  position: relative;
  display: grid;
  align-content: end;
  justify-items: center;
  gap: 6px;
  min-height: 156px;
  padding: 8px;
  overflow: hidden;
  border: 3px solid var(--ink);
  background: var(--paper);
  color: var(--ink);
}

.koma:not(.is-read) {
  place-content: center;
  background:
    radial-gradient(var(--ink) 1px, transparent 1.4px) 0 0 / 6px 6px,
    #cfcabb;
}

.koma__number {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: var(--paper);
  border: 3px solid var(--ink);
  font: 400 0.75rem/1 var(--font-pixel);
}

.koma.is-read {
  animation: ink-in 0.35s ease-out;
}

@keyframes ink-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
}

.koma--calm.is-read {
  background:
    radial-gradient(var(--ink) 0.9px, transparent 1.3px) 0 0 / 7px 7px,
    var(--paper);
}

.koma--impact.is-read {
  background: repeating-conic-gradient(from 0deg at 50% 42%, var(--ink) 0 3deg, var(--paper) 3deg 8deg);
}

.koma--focus.is-read {
  background: linear-gradient(160deg, var(--paper) 55%, #b9b4a5 55%);
}

.koma__face {
  padding: 2px 8px;
  background: var(--paper);
  font: 700 1.25rem/1.3 var(--font-mono);
  white-space: nowrap;
}

.koma__bubble {
  position: relative;
  margin: 0;
  padding: 7px 10px;
  background: #fff;
  border: 2px solid var(--ink);
  border-radius: 14px;
  font: 600 0.72rem/1.35 var(--font-body);
  text-align: center;
  text-transform: uppercase;
}

.koma__bubble::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  width: 12px;
  height: 12px;
  background: #fff;
  border-top: 2px solid var(--ink);
  border-left: 2px solid var(--ink);
  transform: translateX(-50%) rotate(45deg);
}

.koma__caption {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 2px 7px;
  background: var(--ink);
  color: var(--paper);
  font: 700 0.7rem/1.5 var(--font-display);
  letter-spacing: 0.06em;
}

.koma--end .koma__caption {
  top: auto;
  right: 6px;
  bottom: 6px;
  left: auto;
}

.koma--end {
  padding-bottom: 38px;
}

.koma__sfx {
  position: absolute;
  top: 6px;
  left: 6px;
  padding: 0 6px;
  background: var(--paper);
  border: 2px solid var(--ink);
  font: 700 1.2rem/1.3 var(--font-display);
  transform: rotate(-6deg);
}

.manga__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 8px 16px;
  margin-top: 12px;
  color: var(--muted);
  font: 500 0.8rem/1.5 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
