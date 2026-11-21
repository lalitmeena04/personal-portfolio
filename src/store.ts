import { ref } from 'vue'

// Cross-section selection: radar blips select a skill, skill links select a quest.
export const selectedSkill = ref('cpp')
export const selectedQuest = ref('bentley')

export function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView()
}

/** Select a skill and bring the skill tree into view. */
export function inspectSkill(id: string) {
  selectedSkill.value = id
  scrollToId('skills')
}
