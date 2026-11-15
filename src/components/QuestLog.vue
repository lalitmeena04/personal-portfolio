<script setup>
import { computed } from 'vue'
import { quests } from '../data/experience'
import { selectedQuest } from '../store'
import { formatDuration, monthsInclusive } from '../utils/dates'
import SectionHeading from './SectionHeading.vue'

const current = computed(() => quests.find((quest) => quest.id === selectedQuest.value) ?? quests[0])
const duration = computed(() => formatDuration(monthsInclusive(current.value.start, current.value.end)))

function select(id) {
  selectedQuest.value = id
}

function onTabKey(event, index) {
  const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
  if (!step) return
  event.preventDefault()
  const next = quests[(index + step + quests.length) % quests.length]
  select(next.id)
  document.getElementById(`tab-${next.id}`)?.focus()
}
</script>

<template>
  <section id="quests" class="section">
    <div class="wrap">
      <SectionHeading index="02" kicker="Experience" title="Quest Log">
        Three campaigns so far. Pick one to read its objectives.
      </SectionHeading>
      <div v-reveal class="log">
        <div class="log__tabs" role="tablist" aria-label="Companies">
          <button
            v-for="(quest, i) in quests"
            :id="`tab-${quest.id}`"
            :key="quest.id"
            type="button"
            role="tab"
            class="tab"
            :class="{ 'is-selected': quest.id === current.id }"
            :aria-selected="quest.id === current.id"
            aria-controls="quest-panel"
            :tabindex="quest.id === current.id ? 0 : -1"
            @click="select(quest.id)"
            @keydown="onTabKey($event, i)"
          >
            <span class="tab__status" :class="{ 'tab__status--active': !quest.end }">
              {{ quest.end ? 'Cleared' : 'Active' }}
            </span>
            <span class="tab__company">{{ quest.company }}</span>
            <span class="tab__role">{{ quest.ranks[0].title }}</span>
            <span class="tab__period">{{ quest.period }}</span>
          </button>
        </div>

        <article id="quest-panel" class="panel log__panel" role="tabpanel" :aria-labelledby="`tab-${current.id}`">
          <header class="log__head">
            <h3>{{ current.company }}</h3>
            <p>{{ current.location }} · {{ current.period }} · {{ duration }}</p>
          </header>
          <p class="log__brief">{{ current.brief }}</p>

          <section v-for="rank in current.ranks" :key="rank.title" class="rank">
            <h4>
              {{ rank.title }} <span>{{ rank.period }}</span>
            </h4>
            <ul>
              <li v-for="objective in rank.objectives" :key="objective">{{ objective }}</li>
            </ul>
          </section>

          <footer class="log__loot">
            <span class="pixel">Loot</span>
            <span v-for="item in current.loot" :key="item" class="chip">{{ item }}</span>
          </footer>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.log {
  display: grid;
  grid-template-columns: minmax(0, 320px) minmax(0, 1fr);
  gap: 20px;
  align-items: start;
}

.log__tabs {
  display: grid;
  gap: 10px;
}

.tab {
  display: grid;
  gap: 3px;
  padding: 16px 18px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line-2);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.tab:hover {
  border-color: var(--line-2);
  background: var(--panel-2);
}

.tab.is-selected {
  background: var(--accent-dim);
  border-color: var(--accent);
}

.tab__status {
  justify-self: start;
  margin-bottom: 6px;
  color: var(--muted);
  font: 400 0.5rem/1.6 var(--font-pixel);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tab__status--active {
  color: var(--accent);
}

.tab__status--active::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  background: var(--accent);
  animation: pulse 1.2s steps(2) infinite;
}

@keyframes pulse {
  50% {
    opacity: 0;
  }
}

.tab__company {
  font: 700 1.15rem/1.25 var(--font-display);
}

.tab__role {
  font-size: 0.95rem;
}

.tab__period {
  color: var(--muted);
  font: 500 0.82rem/1.5 var(--font-display);
  letter-spacing: 0.06em;
}

.log__head h3 {
  font-size: clamp(1.5rem, 2.6vw, 2rem);
}

.log__head p {
  margin: 6px 0 0;
  color: var(--muted);
  font: 500 0.88rem/1.5 var(--font-display);
  letter-spacing: 0.06em;
}

.log__brief {
  margin: 16px 0 0;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
  color: #c9d0de;
  font-size: 1.05rem;
}

.rank {
  margin-top: 22px;
}

.rank h4 {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 14px;
  font-size: 1.1rem;
}

.rank h4 span {
  color: var(--muted);
  font: 500 0.82rem/1.5 var(--font-display);
  letter-spacing: 0.06em;
}

.rank ul {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.rank li {
  position: relative;
  padding-left: 26px;
  color: #c9d0de;
}

.rank li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: var(--accent);
  font-weight: 700;
}

.log__loot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 26px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
}

.log__loot .pixel {
  margin-right: 6px;
}

@media (max-width: 860px) {
  .log {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
