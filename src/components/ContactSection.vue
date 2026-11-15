<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { unlock } from '../composables/useAchievements'
import { profile } from '../data/profile'
import AppIcon from './AppIcon.vue'
import SectionHeading from './SectionHeading.vue'

const COPIED_MS = 1600

const channels = [
  { id: 'email', icon: 'mail', label: 'Email', value: profile.email, href: `mailto:${profile.email}`, copy: profile.email },
  {
    id: 'phone',
    icon: 'phone',
    label: 'Phone',
    value: profile.phone,
    href: `tel:${profile.phone.replace(/\s/g, '')}`,
    copy: profile.phone,
  },
  { id: 'linkedin', icon: 'linkedin', label: 'LinkedIn', value: profile.linkedinHandle, href: profile.linkedin, external: true },
  { id: 'github', icon: 'github', label: 'GitHub', value: profile.githubHandle, href: profile.github, external: true },
]

const copied = ref('')
const end = ref(null)
let copiedTimer = 0
let observer

async function copy(channel) {
  try {
    await navigator.clipboard.writeText(channel.copy)
    copied.value = channel.id
    clearTimeout(copiedTimer)
    copiedTimer = setTimeout(() => (copied.value = ''), COPIED_MS)
  } catch {
    // Clipboard blocked (insecure context or denied permission): the value is on screen to copy by hand.
  }
}

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    unlock('credits')
    observer.disconnect()
  })
  observer.observe(end.value)
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(copiedTimer)
})
</script>

<template>
  <section id="contact" class="section contact">
    <div class="wrap">
      <SectionHeading index="07" kicker="Contact" title="Player 2, press start">
        Have a role, a project, or a game recommendation? My inbox is open.
      </SectionHeading>

      <ul class="channels">
        <li v-for="(channel, i) in channels" :key="channel.id" v-reveal="i * 60" class="channel">
          <a
            class="channel__link"
            :href="channel.href"
            :target="channel.external ? '_blank' : undefined"
            :rel="channel.external ? 'noopener' : undefined"
          >
            <AppIcon :name="channel.icon" />
            <span>
              <span class="channel__label">{{ channel.label }}</span>
              <strong>{{ channel.value }}</strong>
            </span>
          </a>
          <button
            v-if="channel.copy"
            type="button"
            class="channel__copy"
            :aria-label="`Copy ${channel.label.toLowerCase()}`"
            @click="copy(channel)"
          >
            <AppIcon :name="copied === channel.id ? 'check' : 'copy'" />
            <span aria-live="polite">{{ copied === channel.id ? 'Copied' : 'Copy' }}</span>
          </button>
        </li>
      </ul>
    </div>

    <footer ref="end" class="wrap credits">
      <p>© {{ new Date().getFullYear() }} {{ profile.name }}. Built with Vue 3, Three.js and hand-written CSS.</p>
      <p class="credits__code">
        Psst: <kbd>↑ ↑ ↓ ↓ ← → ← → B A</kbd><span class="credits__touch"> (swipe it, then tap twice)</span>
      </p>
    </footer>
  </section>
</template>

<style scoped>
.contact {
  padding-bottom: 0;
}

.channels {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.channel {
  display: flex;
  background: var(--panel);
  border: 1px solid var(--line);
  transition: border-color 0.15s;
}

.channel:hover,
.channel:focus-within {
  border-color: var(--accent);
}

.channel__link {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  min-width: 0;
  padding: 20px;
  text-decoration: none;
}

.channel__link .icon {
  width: 28px;
  height: 28px;
  color: var(--accent);
}

.channel__link > span {
  display: grid;
  min-width: 0;
}

.channel__label {
  color: var(--muted);
  font: 500 0.76rem/1.6 var(--font-display);
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.channel__link strong {
  font: 700 clamp(1rem, 1.8vw, 1.25rem) / 1.3 var(--font-display);
  overflow-wrap: anywhere;
}

.channel__copy {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 18px;
  background: none;
  border: 0;
  border-left: 1px solid var(--line);
  color: var(--muted);
  font: 700 0.78rem/1 var(--font-display);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
}

.channel__copy:hover {
  color: var(--accent);
}

.channel__copy:focus-visible {
  outline-offset: -4px;
}

.credits {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 24px;
  margin-top: clamp(56px, 8vw, 96px);
  padding-block: 24px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.88rem;
}

.credits p {
  margin: 0;
}

.credits kbd {
  font: 500 0.85rem var(--font-mono);
  letter-spacing: 0.1em;
}

/* Only worth saying where there is a touch screen to swipe on. */
.credits__touch {
  display: none;
}

@media (any-pointer: coarse) {
  .credits__touch {
    display: inline;
  }
}

@media (max-width: 760px) {
  .channels {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* Keep the email address on one line on phones: tighter spacing and an icon-only copy button. */
@media (max-width: 480px) {
  .channel__link {
    gap: 12px;
    padding: 16px;
  }

  .channel__link strong {
    font-size: 0.92rem;
  }

  .channel__copy {
    padding: 0 14px;
  }

  .channel__copy span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
}
</style>
