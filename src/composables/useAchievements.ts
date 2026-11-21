import { reactive, ref } from 'vue'

interface Achievement {
  id: string
  title: string
  hint: string
}

interface Toast {
  key: number
  title: string
}

export const achievements = [
  { id: 'start', title: 'Press Start', hint: 'Begin the tour from the title screen.' },
  { id: 'drive', title: 'Most Wanted', hint: 'Take the wheel on the night drive and grab a skill.' },
  { id: 'snake', title: 'Snake Charmer', hint: 'Score 10 in Snake.' },
  { id: 'mate', title: 'Checkmate', hint: 'Solve a mate-in-one puzzle.' },
  { id: 'juggle', title: 'Keepy-Uppy', hint: 'Juggle the football 10 times.' },
  { id: 'power', title: 'Over 9000', hint: 'Charge the power level past 9000.' },
  { id: 'manga', title: 'Bookworm', hint: 'Read the four-panel strip to the end.' },
  { id: 'wheelie', title: 'One Wheel Wonder', hint: 'Hold a wheelie in the zone for 5 seconds.' },
  { id: 'launch', title: 'Lights Out', hint: 'React to the start lights within 0.35 seconds.' },
  { id: 'konami', title: 'Cheat Code', hint: '↑ ↑ ↓ ↓ ← → ← → B A. On touch, swipe it and tap twice.' },
  { id: 'credits', title: 'Roll Credits', hint: 'Reach the end of the page.' },
] as const satisfies readonly Achievement[]

export type AchievementId = (typeof achievements)[number]['id']

const STORAGE_KEY = 'lkm:achievements'
const TOAST_MS = 4200

const isAchievementId = (value: unknown): value is AchievementId => achievements.some((item) => item.id === value)

function load(): AchievementId[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    // Ignore anything that is not a current achievement, such as one that has since been removed.
    return Array.isArray(saved) ? saved.filter(isAchievementId) : []
  } catch {
    return []
  }
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...unlocked]))
  } catch {
    // Storage can be unavailable (private mode); progress then lasts for the session only.
  }
}

export const unlocked = reactive(new Set<AchievementId>(load()))
export const toasts = ref<Toast[]>([])
let toastKey = 0

export function unlock(id: AchievementId) {
  const achievement = achievements.find((item) => item.id === id)
  if (!achievement || unlocked.has(id)) return
  unlocked.add(id)
  save()
  const key = toastKey++
  toasts.value.push({ key, title: achievement.title })
  setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.key !== key)
  }, TOAST_MS)
}

export function resetAchievements() {
  unlocked.clear()
  save()
}
