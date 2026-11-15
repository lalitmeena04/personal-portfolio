<script setup>
import { onBeforeUnmount, onMounted } from 'vue'
import { unlock } from './composables/useAchievements'
import HudNav from './components/HudNav.vue'
import HeroSection from './components/HeroSection.vue'
import PlayerProfile from './components/PlayerProfile.vue'
import QuestLog from './components/QuestLog.vue'
import SkillTree from './components/SkillTree.vue'
import SideQuests from './components/SideQuests.vue'
import TrophyRoom from './components/TrophyRoom.vue'
import FreeRoam from './components/FreeRoam.vue'
import ContactSection from './components/ContactSection.vue'
import AchievementToasts from './components/AchievementToasts.vue'

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
// On touch screens the arrows are swipes, and a tap stands in for B and for A.
const TAP = 'tap'
const SWIPE_MIN_PX = 40
const TAP_MAX_PX = 10

const recent = []
let touchFrom = null

function enter(input) {
  // Compare the last ten inputs, so a stray swipe or key before the code (scrolling, say) does not spoil it.
  recent.push(input)
  if (recent.length > KONAMI.length) recent.shift()
  if (recent.length < KONAMI.length) return
  if (!KONAMI.every((key, i) => recent[i] === key || (recent[i] === TAP && key.length === 1))) return
  recent.length = 0
  document.documentElement.classList.toggle('god-mode')
  unlock('konami')
}

function onKeydown(event) {
  enter(event.key.length === 1 ? event.key.toLowerCase() : event.key)
}

// Touch events rather than pointer events: the browser cancels pointer events once a swipe starts scrolling the page.
function onTouchStart(event) {
  const [touch] = event.touches
  touchFrom = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null
}

function onTouchEnd(event) {
  if (!touchFrom || event.touches.length) return
  const [touch] = event.changedTouches
  const dx = touch.clientX - touchFrom.x
  const dy = touch.clientY - touchFrom.y
  touchFrom = null
  const across = Math.abs(dx)
  const along = Math.abs(dy)
  if (Math.max(across, along) <= TAP_MAX_PX) {
    enter(TAP)
  } else if (Math.max(across, along) >= SWIPE_MIN_PX && Math.max(across, along) >= 2 * Math.min(across, along)) {
    if (across > along) enter(dx > 0 ? 'ArrowRight' : 'ArrowLeft')
    else enter(dy > 0 ? 'ArrowDown' : 'ArrowUp')
  }
  // Anything else (a short drag, a diagonal) is ambiguous and is ignored.
}

function onTouchCancel() {
  touchFrom = null
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchcancel', onTouchCancel, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('touchstart', onTouchStart)
  window.removeEventListener('touchend', onTouchEnd)
  window.removeEventListener('touchcancel', onTouchCancel)
})
</script>

<template>
  <a class="skip" href="#profile">Skip to content</a>
  <HudNav />
  <main>
    <HeroSection />
    <PlayerProfile />
    <QuestLog />
    <SkillTree />
    <SideQuests />
    <TrophyRoom />
    <FreeRoam />
    <ContactSection />
  </main>
  <AchievementToasts />
  <div class="scanlines" aria-hidden="true"></div>
</template>
