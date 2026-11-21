<script setup lang="ts">
import { achievements, resetAchievements, unlocked } from '../composables/useAchievements'
import { trophies } from '../data/trophies'
import PixelSprite from './PixelSprite.vue'
import SectionHeading from './SectionHeading.vue'

const CUP = [
  '.XXXXXXXXX.',
  'XXXXXXXXXXX',
  'X.XXXXXXX.X',
  'X.XXXXXXX.X',
  '.XXXXXXXXX.',
  '...XXXXX...',
  '....XXX....',
  '....XXX....',
  '...XXXXX...',
  '..XXXXXXX..',
]
</script>

<template>
  <section id="trophies" class="section">
    <div class="wrap">
      <SectionHeading index="05" kicker="Achievements" title="Trophy Room">
        Awards, certifications and milestones from the main campaign.
      </SectionHeading>

      <ul class="cabinet">
        <li
          v-for="(trophy, i) in trophies"
          :key="trophy.title"
          v-reveal="i * 60"
          class="trophy"
          :class="`trophy--${trophy.tier}`"
        >
          <PixelSprite class="trophy__cup" :rows="CUP" />
          <div>
            <p class="trophy__tier">{{ trophy.tier }}</p>
            <h3>{{ trophy.title }}</h3>
            <p class="trophy__source">{{ trophy.source }}</p>
            <p class="trophy__detail">{{ trophy.detail }}</p>
          </div>
        </li>
      </ul>

      <div v-reveal class="panel session">
        <header class="session__head">
          <div>
            <p class="pixel">Your session</p>
            <h3>Visitor achievements</h3>
          </div>
          <p class="session__count">
            <strong>{{ unlocked.size }}</strong> / {{ achievements.length }} unlocked
          </p>
        </header>
        <p class="session__lead">This site keeps score. Explore it, play the mini-games below, and fill the board.</p>
        <ul class="badges">
          <li
            v-for="achievement in achievements"
            :key="achievement.id"
            class="badge"
            :class="{ 'is-unlocked': unlocked.has(achievement.id) }"
          >
            <span class="badge__icon" aria-hidden="true">{{ unlocked.has(achievement.id) ? '★' : '?' }}</span>
            <span class="badge__text">
              <strong>{{ achievement.title }}</strong>
              <span>{{ achievement.hint }}</span>
              <span class="sr-only">{{ unlocked.has(achievement.id) ? 'Unlocked' : 'Locked' }}</span>
            </span>
          </li>
        </ul>
        <button v-if="unlocked.size" type="button" class="btn btn--sm session__reset" @click="resetAchievements">
          Reset progress
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cabinet {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.trophy {
  --tier: var(--gold);
  display: grid;
  grid-template-columns: 52px minmax(0, 1fr);
  gap: 18px;
  padding: 20px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-top: 3px solid var(--tier);
}

.trophy--silver {
  --tier: #c3cbdb;
}

.trophy--bronze {
  --tier: #d98a57;
}

.trophy__cup {
  width: 52px;
  color: var(--tier);
}

.trophy__tier {
  margin: 0;
  color: var(--tier);
  font: 400 0.5rem/1.6 var(--font-pixel);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.trophy h3 {
  margin-top: 8px;
  font-size: 1.15rem;
  line-height: 1.3;
}

.trophy__source {
  margin: 6px 0 0;
  color: var(--muted);
  font: 500 0.82rem/1.5 var(--font-display);
  letter-spacing: 0.05em;
}

.trophy__detail {
  margin: 8px 0 0;
  color: var(--text-soft);
  font-size: 0.93rem;
  line-height: 1.5;
}

.session {
  margin-top: 28px;
}

.session__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px 24px;
}

.session__head h3 {
  margin-top: 10px;
  font-size: clamp(1.4rem, 2.4vw, 1.8rem);
}

.session__count {
  margin: 0;
  color: var(--muted);
  font: 500 0.95rem/1.2 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.session__count strong {
  color: var(--accent);
  font-size: 1.6rem;
}

.session__lead {
  margin: 12px 0 0;
  color: var(--muted);
}

.badges {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 10px;
  margin-top: 20px;
}

.badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px dashed var(--line-2);
  color: var(--muted);
}

.badge__icon {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  flex: none;
  background: var(--line);
  font: 700 1.1rem/1 var(--font-display);
}

.badge__text {
  display: grid;
  gap: 2px;
  font-size: 0.85rem;
  line-height: 1.4;
}

.badge__text strong {
  font: 700 0.98rem/1.3 var(--font-display);
}

.badge.is-unlocked {
  border-style: solid;
  border-color: var(--accent);
  background: var(--accent-dim);
}

.badge.is-unlocked strong {
  color: var(--text);
}

.badge.is-unlocked .badge__icon {
  background: var(--accent);
  color: var(--accent-ink);
}

.session__reset {
  margin-top: 18px;
}
</style>
