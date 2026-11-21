<script setup lang="ts">
import { level, levelProgress, profile, signatureSkills } from '../data/profile'
import { inspectSkill } from '../store'
import { formatDuration, monthsInclusive } from '../utils/dates'
import portrait from '../assets/lalit.jpg'
import SectionHeading from './SectionHeading.vue'

const experience = formatDuration(monthsInclusive(profile.careerStart) - 1)

const sheet: [term: string, value: string][] = [
  ['Class', profile.playerClass],
  ['Guild', profile.company],
  ['Domain', profile.domains.join(' · ')],
  ['Region', profile.location],
  ['Main weapon', 'C++'],
  ['Origin', profile.education],
  ['Off-duty', profile.hobbies.join(' · ')],
]
</script>

<template>
  <section id="profile" class="section">
    <div class="wrap">
      <SectionHeading index="01" kicker="Profile" title="Player Profile" />
      <div class="profile">
        <aside v-reveal class="panel card">
          <figure class="card__portrait">
            <img :src="portrait" width="720" height="960" alt="Portrait of Lalit Kumar Meena" />
            <figcaption>
              <span class="pixel">Player 1</span>
              <strong>{{ profile.name }}</strong>
              <span>{{ profile.role }}</span>
            </figcaption>
          </figure>
          <div class="card__level">
            <span class="pixel">LVL {{ level }}</span>
            <div class="card__xp" aria-hidden="true"><span :style="{ width: `${levelProgress * 100}%` }"></span></div>
            <span class="card__xp-text">{{ experience }} XP</span>
          </div>
          <dl class="card__sheet">
            <div v-for="[term, value] in sheet" :key="term">
              <dt>{{ term }}</dt>
              <dd>{{ value }}</dd>
            </div>
          </dl>
        </aside>

        <div class="profile__main">
          <div v-reveal class="profile__bio">
            <p>
              I'm a software engineer who builds high-performance, human-friendly interfaces in <strong>C++</strong> and
              <strong>Qt</strong>. I started at TATA Advanced Systems, where I rebuilt the HMI of an electronic-warfare
              system and prototyped a 3D simulator for real-time sensor data. At Delta IoT I wrote embedded display
              software for a global agricultural-equipment OEM.
            </p>
            <p>
              Today I'm a <strong>{{ profile.role }}</strong> at <strong>{{ profile.company }}</strong> in Pune, working
              on <strong>infrastructure engineering software</strong> and <strong>digital twins</strong>. Off the clock
              I build my own Windows tools in Qt 6 and QML, and play a lot of video games, which is probably why I care
              so much about how software feels in the hand.
            </p>
          </div>
          <p v-reveal class="pixel moves__title">Signature skills</p>
          <ul class="moves">
            <li v-for="(skill, i) in signatureSkills" :key="skill.id" v-reveal="i * 80">
              <button type="button" class="move" :class="`move--${skill.tone}`" @click="inspectSkill(skill.id)">
                <span class="move__name">{{ skill.name }}</span>
                <span class="move__label">{{ skill.label }}</span>
                <span class="move__more">Open in skill tree <span aria-hidden="true">→</span></span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile {
  display: grid;
  grid-template-columns: minmax(0, 360px) minmax(0, 1fr);
  gap: clamp(24px, 4vw, 56px);
  align-items: start;
}

.card {
  padding: 0;
}

.card__portrait {
  position: relative;
  aspect-ratio: 4 / 3.6;
  overflow: hidden;
}

.card__portrait img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 12%;
}

.card__portrait figcaption {
  position: absolute;
  inset: auto 0 0;
  display: grid;
  gap: 4px;
  padding: 56px 20px 16px;
  background: linear-gradient(transparent, rgba(9, 11, 16, 0.94) 62%);
}

.card__portrait strong {
  font: 700 1.45rem/1.15 var(--font-display);
}

.card__portrait figcaption > span:last-child {
  color: var(--muted);
  font: 500 0.95rem/1.3 var(--font-display);
}

.card__level {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-block: 1px solid var(--line);
}

.card__xp {
  height: 8px;
  background: var(--line);
}

.card__xp span {
  display: block;
  height: 100%;
  min-width: 4px;
  background: var(--accent);
}

.card__xp-text {
  color: var(--muted);
  font: 500 0.8rem/1 var(--font-display);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.card__sheet {
  display: grid;
  padding: 8px 20px 16px;
}

.card__sheet > div {
  display: grid;
  grid-template-columns: 104px 1fr;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--line);
}

.card__sheet > div:last-child {
  border-bottom: 0;
}

.card__sheet dt {
  color: var(--muted);
  font: 500 0.74rem/1.7 var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.card__sheet dd {
  font-size: 0.95rem;
  line-height: 1.45;
}

.profile__bio {
  font-size: clamp(1.05rem, 1.5vw, 1.2rem);
  line-height: 1.7;
  color: var(--text-soft);
}

.profile__bio strong {
  color: var(--text);
  font-weight: 600;
}

.moves__title {
  margin-top: 28px;
}

.moves {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 14px;
}

.move {
  --tone: var(--accent);
  display: grid;
  align-content: start;
  gap: 8px;
  width: 100%;
  height: 100%;
  padding: 18px 20px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 3px solid var(--tone);
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.move:hover {
  background: var(--panel-2);
  border-color: var(--tone);
}

.move--mp {
  --tone: var(--mp);
}

.move--gold {
  --tone: var(--gold);
}

.move--hp {
  --tone: var(--hp);
}

.move__name {
  color: var(--tone);
  font: 700 clamp(1.5rem, 2.6vw, 2rem) / 1.1 var(--font-display);
}

.move__label {
  color: var(--text-soft);
  font-size: 0.95rem;
  line-height: 1.5;
}

.move__more {
  color: var(--muted);
  font: 500 0.74rem/1.5 var(--font-display);
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.move:hover .move__more {
  color: var(--tone);
}

@media (max-width: 860px) {
  .profile {
    grid-template-columns: minmax(0, 1fr);
  }

  .card {
    max-width: 440px;
  }
}

@media (max-width: 480px) {
  .moves {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
