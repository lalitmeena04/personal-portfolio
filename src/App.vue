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
let konamiStep = 0

function onKeydown(event) {
  const key = event.key.length === 1 ? event.key.toLowerCase() : event.key
  if (key === KONAMI[konamiStep]) konamiStep++
  else konamiStep = key === KONAMI[0] ? 1 : 0
  if (konamiStep < KONAMI.length) return
  konamiStep = 0
  document.documentElement.classList.toggle('god-mode')
  unlock('konami')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
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
