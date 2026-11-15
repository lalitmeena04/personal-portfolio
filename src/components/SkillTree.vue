<script setup>
import { computed } from 'vue'
import { allSkills, skillGroups } from '../data/skills'
import { scrollToId, selectedQuest, selectedSkill } from '../store'
import SectionHeading from './SectionHeading.vue'

const current = computed(() => allSkills.find((skill) => skill.id === selectedSkill.value) ?? allSkills[0])

function select(id) {
  selectedSkill.value = id
}

function jump(use) {
  if (use.kind === 'quest') {
    selectedQuest.value = use.id
    scrollToId('quests')
  } else {
    scrollToId(`project-${use.id}`)
  }
}
</script>

<template>
  <section id="skills" class="section">
    <div class="wrap">
      <SectionHeading index="03" kicker="Skills" title="Skill Tree">
        Select a skill to see where it has been battle-tested.
      </SectionHeading>
      <div class="tree">
        <aside class="panel tree__detail" aria-live="polite">
          <p class="pixel">{{ current.group }}</p>
          <h3>{{ current.name }}</h3>
          <p class="tree__blurb">{{ current.blurb }}</p>
          <template v-if="current.used.length">
            <p class="tree__label">Battle-tested in</p>
            <ul class="tree__uses">
              <li v-for="use in current.used" :key="use.label">
                <span v-if="use.kind === 'note'" class="chip">{{ use.label }}</span>
                <button v-else type="button" class="chip tree__jump" @click="jump(use)">
                  {{ use.label }} <span aria-hidden="true">→</span>
                </button>
              </li>
            </ul>
          </template>
        </aside>

        <div class="tree__groups">
          <section v-for="group in skillGroups" :key="group.title" v-reveal class="group">
            <h3 class="group__title">{{ group.title }}</h3>
            <div class="group__nodes">
              <button
                v-for="skill in group.skills"
                :key="skill.id"
                type="button"
                class="node"
                :class="{ 'is-selected': skill.id === current.id }"
                :aria-pressed="skill.id === current.id"
                @click="select(skill.id)"
              >
                {{ skill.name }}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tree {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
  gap: clamp(24px, 4vw, 48px);
  align-items: start;
}

.tree__groups {
  display: grid;
  gap: 4px;
  grid-row: 1;
}

.group {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
  padding: 16px 0;
  border-top: 1px solid var(--line);
}

.group__title {
  padding-top: 10px;
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.group__nodes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.node {
  min-height: 42px;
  padding: 0 16px;
  background: var(--panel);
  border: 1px solid var(--line-2);
  font: 700 0.95rem/1 var(--font-display);
  letter-spacing: 0.03em;
  cursor: pointer;
  clip-path: polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px);
  transition:
    background-color 0.15s,
    color 0.15s;
}

.node:hover {
  background: var(--line);
}

.node.is-selected {
  background: var(--accent);
  color: var(--accent-ink);
}

.node:focus-visible {
  outline-offset: -4px;
  outline-color: var(--text);
}

.node.is-selected:focus-visible {
  outline-color: var(--accent-ink);
}

.tree__detail {
  position: sticky;
  top: calc(var(--hud-h) + 20px);
  grid-column: 2;
  min-height: 250px;
}

.tree__detail h3 {
  margin-top: 12px;
  font-size: clamp(1.7rem, 3vw, 2.3rem);
}

.tree__blurb {
  margin: 12px 0 0;
  color: #c9d0de;
}

.tree__label {
  margin: 20px 0 10px;
  color: var(--muted);
  font: 500 0.76rem/1.5 var(--font-display);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.tree__uses {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tree__jump {
  background: none;
  border-color: var(--accent);
  color: var(--accent);
  cursor: pointer;
}

.tree__jump:hover {
  background: var(--accent);
  color: var(--accent-ink);
}

@media (max-width: 900px) {
  .tree {
    grid-template-columns: minmax(0, 1fr);
  }

  /* Keep the detail panel in view while tapping through skills below it. */
  .tree__detail {
    grid-column: 1;
    grid-row: 1;
    z-index: 5;
    top: calc(var(--hud-h) + 8px);
    min-height: 0;
    padding: 16px;
    background: var(--panel-2);
  }

  .tree__groups {
    grid-row: 2;
  }

  .tree__detail h3 {
    margin-top: 6px;
    font-size: 1.4rem;
  }

  .tree__blurb {
    margin-top: 6px;
    font-size: 0.92rem;
    line-height: 1.5;
  }

  .tree__label {
    margin: 10px 0 6px;
  }

  .group {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }

  .group__title {
    padding-top: 0;
  }
}
</style>
