<script setup>
import { level, profile } from '../data/profile'
import { unlock } from '../composables/useAchievements'
import AppIcon from './AppIcon.vue'
import DriveScene from './DriveScene.vue'
</script>

<template>
  <section id="start" class="hero">
    <DriveScene class="hero__scene" />
    <div class="wrap hero__copy">
      <div class="hero__inner">
        <p class="pixel hero__ready"><span class="hero__dot" aria-hidden="true"></span>Player 1 ready</p>
        <h1 class="hero__name">Lalit Kumar <span>Meena</span></h1>
        <p class="hero__role">
          {{ profile.role }} <span class="hero__at" aria-hidden="true">//</span><span class="sr-only">at</span>
          {{ profile.company }}
        </p>
        <p class="hero__tag">
          C++ and Qt engineer, currently building infrastructure engineering software and digital twins. Before that:
          defence consoles and embedded displays. Gamer the rest of the time.
        </p>
        <div class="hero__cta">
          <a class="btn btn--primary" href="#profile" @click="unlock('start')"><span aria-hidden="true">▶</span> Press Start</a>
          <a class="btn" :href="profile.github" target="_blank" rel="noopener"><AppIcon name="github" /> GitHub</a>
          <a class="btn" :href="profile.linkedin" target="_blank" rel="noopener"><AppIcon name="linkedin" /> LinkedIn</a>
        </div>
        <dl class="hero__meta">
          <div>
            <dt>Class</dt>
            <dd>C++ / Qt Engineer</dd>
          </div>
          <div>
            <dt>Level</dt>
            <dd>{{ level }}</dd>
          </div>
          <div>
            <dt>Region</dt>
            <dd>Pune, IN</dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Title screen: the night drive fills the hero and the copy sits over its left side. */
.hero {
  position: relative;
  display: grid;
  align-items: center;
  min-height: 100svh;
  padding: calc(var(--hud-h) + 24px) 0 72px;
  overflow: hidden;
}

.hero__scene {
  position: absolute;
  inset: 0;
}

/* The copy wrapper spans the page, so let pointer events through to the scene around the text. */
.hero__copy {
  position: relative;
  z-index: 1;
  pointer-events: none;
}

.hero__inner {
  max-width: 560px;
  pointer-events: auto;
}

.hero__ready {
  display: flex;
  align-items: center;
  gap: 10px;
}

.hero__dot {
  width: 8px;
  height: 8px;
  background: var(--accent);
  animation: blink 1.2s steps(2) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

.hero__name {
  margin-top: 20px;
  font-size: clamp(2.7rem, 6.2vw, 5.2rem);
  line-height: 0.95;
  text-transform: uppercase;
}

.hero__name span {
  display: block;
  color: var(--accent);
}

.hero__role {
  margin: 22px 0 0;
  font: 700 clamp(1.1rem, 2vw, 1.45rem) / 1.3 var(--font-display);
  letter-spacing: 0.02em;
}

.hero__at {
  color: var(--accent);
}

.hero__tag {
  max-width: 46ch;
  margin: 14px 0 0;
  color: #b4bccd;
  font-size: 1.05rem;
}

.hero__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 32px;
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.hero__meta dt {
  color: var(--muted);
  font: 500 0.72rem/1.4 var(--font-display);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero__meta dd {
  font: 700 1rem/1.4 var(--font-display);
}

/* Narrow screens: copy first, then the drive as a band with the loadout under it. */
@media (max-width: 1080px) {
  .hero {
    display: flex;
    flex-direction: column;
    min-height: 0;
    padding-bottom: 0;
  }

  .hero__scene {
    position: static;
    order: 2;
    margin-top: 28px;
  }

  .hero__inner {
    max-width: none;
  }
}
</style>
