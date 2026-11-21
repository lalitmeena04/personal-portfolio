<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import { profile } from '../data/profile'
import SectionHeading from './SectionHeading.vue'
import KeepyUppy from './hobbies/KeepyUppy.vue'
import MangaStrip from './hobbies/MangaStrip.vue'
import PowerUp from './hobbies/PowerUp.vue'
import SnakeGame from './hobbies/SnakeGame.vue'
import StartLights from './hobbies/StartLights.vue'
import WheelieGame from './hobbies/WheelieGame.vue'

// chess.js is only needed here, so it ships in its own chunk.
const ChessPuzzle = defineAsyncComponent(() => import('./hobbies/ChessPuzzle.vue'))
</script>

<template>
  <section id="freeroam" class="section">
    <div class="wrap">
      <SectionHeading index="06" kicker="Hobbies" title="Free Roam">
        What I do between quests. Everything here is playable, and each one hides an achievement.
      </SectionHeading>

      <div class="bento">
        <article v-reveal class="panel hobby hobby--gaming">
          <header>
            <p class="pixel">Hobby 01</p>
            <h3>Gaming</h3>
            <p>
              Video games are why this portfolio looks the way it does. Here is the one everybody has played: Snake, the
              way it ran on a Nokia.
            </p>
            <ul class="games" aria-label="Favourite games">
              <li v-for="game in profile.favouriteGames" :key="game" class="chip">{{ game }}</li>
              <li class="games__more">and many more</li>
            </ul>
          </header>
          <SnakeGame />
        </article>

        <article v-reveal class="panel hobby hobby--chess">
          <header>
            <p class="pixel">Hobby 02</p>
            <h3>Chess</h3>
            <p>Three quick puzzles. Pick a white piece, then a highlighted square.</p>
          </header>
          <ChessPuzzle />
        </article>

        <article v-reveal class="panel hobby">
          <header>
            <p class="pixel">Hobby 03</p>
            <h3>Football</h3>
            <p>Tap the ball to keep it off the ground. Ten touches earns a trophy.</p>
          </header>
          <KeepyUppy />
        </article>

        <article v-reveal="80" class="panel hobby">
          <header>
            <p class="pixel">Hobby 04</p>
            <h3>Anime</h3>
            <p>Every good arc needs a power-up. Hold the button and charge past 9000.</p>
          </header>
          <PowerUp />
        </article>

        <article v-reveal="160" class="panel hobby">
          <header>
            <p class="pixel">Hobby 05</p>
            <h3>Manga</h3>
            <p>A four-panel strip about the day job.</p>
          </header>
          <MangaStrip />
        </article>

        <article v-reveal class="panel hobby hobby--half">
          <header>
            <p class="pixel">Hobby 06</p>
            <h3>Bikes</h3>
            <p>Hold the throttle to lift the front wheel, then feather it. Five seconds in the zone earns a trophy.</p>
          </header>
          <WheelieGame />
        </article>

        <article v-reveal="80" class="panel hobby hobby--half">
          <header>
            <p class="pixel">Hobby 07</p>
            <h3>Cars</h3>
            <p>Five red lights, then none. Launch the moment they go out. Under 0.35 seconds earns a trophy.</p>
          </header>
          <StartLights />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bento {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 20px;
}

.hobby {
  grid-column: span 4;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.hobby--gaming {
  grid-column: span 7;
}

.hobby--chess {
  grid-column: span 5;
}

.hobby--half {
  grid-column: span 6;
}

.hobby header {
  flex: 1;
}

.hobby h3 {
  margin-top: 10px;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
  text-transform: uppercase;
}

.hobby header p:last-of-type {
  margin: 8px 0 0;
  color: var(--muted);
}

.games {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.games .chip {
  color: var(--text);
}

.games__more {
  color: var(--muted);
  font: 500 0.78rem/1.5 var(--font-display);
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

@media (max-width: 1040px) {
  .hobby,
  .hobby--gaming,
  .hobby--chess {
    grid-column: span 6;
  }

  .hobby--gaming {
    grid-column: 1 / -1;
  }
}

@media (max-width: 700px) {
  .hobby,
  .hobby--gaming,
  .hobby--chess {
    grid-column: 1 / -1;
  }
}
</style>
