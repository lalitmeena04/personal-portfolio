<script setup lang="ts">
import { unlock } from './composables/useAchievements'
import { useCheatCode } from './composables/useCheatCode'
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

useCheatCode(() => {
  document.documentElement.classList.toggle('god-mode')
  unlock('konami')
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
