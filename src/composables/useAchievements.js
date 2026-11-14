import { reactive, ref } from 'vue'

export const achievements = [
  { id: 'start', title: 'Press Start', hint: 'Begin the tour from the title screen.' },
  { id: 'drive', title: 'Most Wanted', hint: 'Take the wheel on the night drive and grab a skill.' },
  { id: 'snake', title: 'Snake Charmer', hint: 'Score 10 in Snake.' },
  { id: 'mate', title: 'Checkmate', hint: 'Solve a mate-in-one puzzle.' },
  { id: 'juggle', title: 'Keepy-Uppy', hint: 'Juggle the football 10 times.' },
  { id: 'power', title: 'Over 9000', hint: 'Charge the power level past 9000.' },
  { id: 'manga', title: 'Bookworm', hint: 'Read the four-panel strip to the end.' },
  { id: 'konami', title: 'Cheat Code', hint: '↑ ↑ ↓ ↓ ← → ← → B A' },
  { id: 'credits', title: 'Roll Credits', hint: 'Reach the end of the page.' },
]

const STORAGE_KEY = 'lkm:achievements'
const TOAST_MS = 4200

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return Array.isArray(saved) ? saved : []
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

export const unlocked = reactive(new Set(load()))
export const toasts = ref([])
let toastKey = 0

export function unlock(id) {
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
