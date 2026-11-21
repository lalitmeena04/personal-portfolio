<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref, type ComponentPublicInstance } from 'vue'
import { heroSkills } from '../data/skills'
import { inspectSkill } from '../store'
import { unlock } from '../composables/useAchievements'

const TAGS = 3 // pickups that can be on the road at once

const stage = ref<HTMLElement | null>(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const speed = ref<HTMLElement | null>(null)
const tags: HTMLElement[] = []
const status = ref<'loading' | 'live' | 'still' | 'fallback'>('loading')
const manual = ref(false)
const collected = reactive(new Set<string>())
let dispose: (() => void) | null = null
let unmounted = false

function setTag(el: Element | ComponentPublicInstance | null, index: number) {
  if (el instanceof HTMLElement) tags[index] = el
}

onMounted(async () => {
  try {
    const { createDrive } = await import('../three/drive')
    if (unmounted || !stage.value || !canvas.value) return
    dispose = createDrive({
      host: stage.value,
      canvas: canvas.value,
      tags,
      skills: heroSkills.map((skill) => skill.name),
      speedEl: speed.value,
      onMode: (isManual) => (manual.value = isManual),
      onCollect(index, byVisitor) {
        collected.add(heroSkills[index].id)
        if (byVisitor) unlock('drive')
      },
    })
    status.value = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'still' : 'live'
  } catch {
    // No WebGL (or the chunk failed to load): the loadout panel still lists every skill.
    status.value = 'fallback'
  }
})

onBeforeUnmount(() => {
  unmounted = true
  dispose?.()
})
</script>

<template>
  <div class="drive" :class="`drive--${status}`">
    <div ref="stage" class="drive__stage">
      <canvas ref="canvas" aria-hidden="true"></canvas>
      <div class="drive__scrim" aria-hidden="true"></div>
      <span v-for="n in TAGS" :key="n" :ref="(el) => setTag(el, n - 1)" class="drive__tag" aria-hidden="true"></span>
      <p v-show="status === 'live'" class="drive__status">
        <span>
          <b aria-hidden="true">◉</b> {{ manual ? "You're driving" : 'Autopilot' }}
          <span class="drive__hint">· Move, drag or press ← → to steer</span>
        </span>
        <span ref="speed" class="drive__speed" aria-hidden="true">196 km/h</span>
      </p>
    </div>

    <section class="drive__loadout" aria-label="Skill loadout">
      <p class="pixel">
        Loadout
        <span v-if="status === 'live'">{{ collected.size }}/{{ heroSkills.length }}</span>
      </p>
      <ul>
        <li v-for="skill in heroSkills" :key="skill.id">
          <button
            type="button"
            class="drive__skill"
            :class="{ 'is-collected': collected.has(skill.id) }"
            @click="inspectSkill(skill.id)"
          >
            {{ skill.name }}
          </button>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.drive__stage {
  position: absolute;
  inset: 0;
  touch-action: pan-y;
}

.drive canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.drive--fallback .drive__stage {
  display: none;
}

/* Keeps the hero copy readable where it overlaps the scene. */
.drive__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(9, 11, 16, 0.92) 0%, rgba(9, 11, 16, 0.6) 32%, transparent 56%);
  pointer-events: none;
}

.drive__tag {
  position: absolute;
  top: 0;
  left: 0;
  padding: 3px 8px;
  background: rgba(9, 11, 16, 0.8);
  border: 1px solid rgba(196, 245, 66, 0.5);
  color: var(--accent);
  font: 700 0.72rem/1.4 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  will-change: transform;
}

.drive__status {
  position: absolute;
  right: max(20px, calc((100vw - var(--wrap)) / 2));
  bottom: 20px;
  left: max(20px, calc((100vw - var(--wrap)) / 2));
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin: 0;
  color: var(--text);
  font: 700 0.78rem/1.4 var(--font-display);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  pointer-events: none;
}

.drive__status b {
  color: var(--accent);
}

.drive__hint {
  color: var(--muted);
  font-weight: 500;
}

.drive__speed {
  color: var(--accent);
  font: 400 0.7rem/1.4 var(--font-pixel);
  white-space: nowrap;
}

.drive__loadout {
  position: absolute;
  top: calc(var(--hud-h) + 28px);
  right: max(20px, calc((100vw - var(--wrap)) / 2));
  z-index: 2;
  width: 290px;
  padding: 14px;
  background: rgba(9, 11, 16, 0.74);
  border: 1px solid var(--line);
}

.drive__loadout .pixel {
  display: flex;
  justify-content: space-between;
}

.drive__loadout .pixel span {
  color: var(--text);
}

.drive__loadout ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  margin-top: 12px;
}

.drive__skill {
  width: 100%;
  padding: 5px 8px;
  background: none;
  border: 1px solid var(--line-2);
  color: var(--muted);
  font: 700 0.72rem/1.4 var(--font-display);
  letter-spacing: 0.06em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition:
    color 0.15s,
    border-color 0.15s;
}

.drive__skill:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.drive__skill.is-collected {
  border-color: var(--accent);
  background: var(--accent-dim);
  color: var(--accent);
  animation: grab 0.5s ease-out;
}

@keyframes grab {
  from {
    background: var(--accent);
    color: var(--accent-ink);
  }
}

@media (max-width: 1080px) {
  .drive__stage {
    position: relative;
    inset: auto;
    height: min(92vw, 440px);
  }

  .drive__scrim {
    display: none;
  }

  .drive__status {
    bottom: 12px;
    font-size: 0.7rem;
  }

  .drive__loadout {
    position: static;
    width: auto;
    margin: 16px 20px 0;
  }

  .drive__loadout ul {
    grid-template-columns: repeat(auto-fill, minmax(132px, 1fr));
  }
}

@media (max-width: 560px) {
  .drive__hint {
    display: none;
  }
}
</style>
