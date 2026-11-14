import { ref } from 'vue'

// Cross-section selection: radar blips select a skill, skill links select a quest.
export const selectedSkill = ref('cpp')
export const selectedQuest = ref('bentley')

export function scrollToId(id) {
  document.getElementById(id)?.scrollIntoView()
}
