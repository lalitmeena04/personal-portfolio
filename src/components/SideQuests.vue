<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  forks as seedForks,
  hiddenRepos,
  languageColors,
  projects as seedProjects,
  type Project,
} from '../data/projects'
import { profile } from '../data/profile'
import AppIcon from './AppIcon.vue'
import LinkMenu from './LinkMenu.vue'
import SectionHeading from './SectionHeading.vue'

/** The fields this page reads from the GitHub REST API's repository objects. */
interface GitHubRepo {
  name: string
  description: string | null
  language: string | null
  fork: boolean
  archived: boolean
  stargazers_count: number
  pushed_at: string
  html_url: string
}

const MAX_LANGUAGES = 4
const projects = ref(seedProjects.map((project) => ({ ...project })))
const forks = ref(seedForks)
const live = ref(false)

const monthYear = new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric' })
const formatDate = (iso: string) => monthYear.format(new Date(iso))

function languageShares(languages: Project['languages']) {
  const total = languages.reduce((sum, [, bytes]) => sum + bytes, 0)
  if (!total) return []
  const shares = languages.slice(0, MAX_LANGUAGES).map(([name, bytes]) => ({ name, pct: (bytes / total) * 100 }))
  const rest = 100 - shares.reduce((sum, share) => sum + share.pct, 0)
  if (rest >= 0.5) shares.push({ name: 'Other', pct: rest })
  return shares.map((share) => ({ ...share, color: languageColors[share.name] ?? languageColors.Other }))
}

const languageSummary = (languages: Project['languages']) =>
  languageShares(languages)
    .map((share) => `${share.name} ${Math.round(share.pct)}%`)
    .join(', ')

// Refresh stars and dates from GitHub and pick up repositories created after this site was built.
async function refreshFromGitHub() {
  const response = await fetch(`https://api.github.com/users/${profile.githubHandle}/repos?per_page=100&sort=updated`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (!response.ok) return
  const repos: GitHubRepo[] = await response.json()
  const byName = new Map(repos.map((repo) => [repo.name, repo]))

  for (const project of projects.value) {
    const repo = byName.get(project.repo)
    if (!repo) continue
    project.stars = repo.stargazers_count
    project.pushedAt = repo.pushed_at
  }

  const known = new Set([...seedProjects.map((project) => project.repo), ...hiddenRepos])
  for (const repo of repos) {
    if (repo.fork || repo.archived || known.has(repo.name)) continue
    projects.value.push({
      repo: repo.name,
      title: repo.name,
      kind: 'New on GitHub',
      tagline: repo.description ?? 'Freshly pushed. Details are in the repository.',
      description: '',
      highlights: [],
      languages: repo.language ? [[repo.language, 1]] : [],
      stars: repo.stargazers_count,
      pushedAt: repo.pushed_at,
      links: [{ label: 'Source', href: repo.html_url }],
    })
  }

  forks.value = repos
    .filter((repo) => repo.fork)
    .map((repo) => ({ name: repo.name, description: repo.description ?? '', href: repo.html_url }))
  live.value = true
}

onMounted(() => {
  // Offline or rate-limited: the bundled snapshot stays on screen.
  refreshFromGitHub().catch(() => {})
})
</script>

<template>
  <section id="projects" class="section">
    <div class="wrap">
      <SectionHeading index="04" kicker="Projects" title="Side Quests">
        What I build when nobody is assigning tickets. Pulled from
        <a :href="profile.github" target="_blank" rel="noopener">github.com/{{ profile.githubHandle }}</a
        >.
      </SectionHeading>

      <p class="sync" :class="{ 'sync--live': live }">
        <span aria-hidden="true"></span>{{ live ? 'Synced live with GitHub' : 'Showing saved snapshot' }}
      </p>

      <div class="quests">
        <article
          v-for="project in projects"
          :id="`project-${project.repo}`"
          :key="project.repo"
          v-reveal
          class="panel quest"
          :class="{ 'quest--featured': project.featured }"
        >
          <header class="quest__head">
            <div>
              <p class="pixel">{{ project.kind }}</p>
              <h3>{{ project.title }}</h3>
            </div>
            <p class="quest__meta">
              <span><AppIcon name="star" /> {{ project.stars }}<span class="sr-only"> stars</span></span>
              <span v-if="project.pushedAt">Updated {{ formatDate(project.pushedAt) }}</span>
            </p>
          </header>

          <div class="quest__body">
            <div>
              <p class="quest__tagline">{{ project.tagline }}</p>
              <p v-if="project.description" class="quest__description">{{ project.description }}</p>
            </div>
            <ul v-if="project.highlights.length" class="quest__highlights">
              <li v-for="highlight in project.highlights" :key="highlight">{{ highlight }}</li>
            </ul>
          </div>

          <footer class="quest__foot">
            <div v-if="project.languages.length" class="langs">
              <div class="langs__bar" role="img" :aria-label="`Languages: ${languageSummary(project.languages)}`">
                <span
                  v-for="share in languageShares(project.languages)"
                  :key="share.name"
                  :style="{ width: `${share.pct}%`, background: share.color }"
                ></span>
              </div>
              <ul class="langs__legend" aria-hidden="true">
                <li v-for="share in languageShares(project.languages)" :key="share.name">
                  <i :style="{ background: share.color }"></i>{{ share.name }}
                  <span>{{ share.pct.toFixed(share.pct < 10 ? 1 : 0) }}%</span>
                </li>
              </ul>
            </div>
            <div class="quest__links">
              <template v-for="(link, i) in project.links" :key="link.label">
                <LinkMenu v-if="'options' in link" :label="link.label" :options="link.options" />
                <a
                  v-else
                  class="btn btn--sm"
                  :class="{ 'btn--primary': i === 0 }"
                  :href="link.href"
                  target="_blank"
                  rel="noopener"
                >
                  <AppIcon :name="i === 0 ? 'github' : 'external'" /> {{ link.label }}
                </a>
              </template>
            </div>
          </footer>
        </article>
      </div>

      <div v-if="forks.length" v-reveal class="forks">
        <h3 class="forks__title">Also exploring <span>(forks)</span></h3>
        <ul>
          <li v-for="fork in forks" :key="fork.name">
            <a :href="fork.href" target="_blank" rel="noopener">
              <strong>{{ fork.name }} <AppIcon name="external" /></strong>
              <span>{{ fork.description }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.sync {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: -16px 0 24px;
  color: var(--muted);
  font: 500 0.78rem/1.5 var(--font-display);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sync span {
  width: 8px;
  height: 8px;
  background: var(--muted);
}

.sync--live span {
  background: var(--accent);
}

.quests {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.quest {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.quest--featured {
  grid-column: 1 / -1;
}

.quest__head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px 20px;
}

.quest__head h3 {
  margin-top: 10px;
  font-size: clamp(1.5rem, 2.6vw, 2rem);
}

.quest--featured .quest__head h3 {
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
}

.quest__meta {
  display: flex;
  gap: 16px;
  margin: 0;
  color: var(--muted);
  font: 500 0.82rem/1.5 var(--font-display);
  letter-spacing: 0.06em;
}

.quest__meta > span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.quest__meta .icon {
  color: var(--gold);
}

.quest__body {
  display: grid;
  gap: 16px;
}

.quest--featured .quest__body {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  gap: 32px;
}

.quest__tagline {
  margin: 0;
  font-size: 1.1rem;
  line-height: 1.5;
}

.quest__description {
  margin: 12px 0 0;
  color: var(--muted);
}

.quest__highlights {
  display: grid;
  gap: 9px;
  align-content: start;
}

.quest__highlights li {
  position: relative;
  padding-left: 22px;
  color: var(--text-soft);
  font-size: 0.97rem;
  line-height: 1.55;
}

.quest__highlights li::before {
  content: '';
  position: absolute;
  top: 0.6em;
  left: 2px;
  width: 7px;
  height: 7px;
  background: var(--accent);
}

.quest__foot {
  display: grid;
  gap: 18px;
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.langs__bar {
  display: flex;
  height: 8px;
  gap: 2px;
}

.langs__bar span {
  min-width: 3px;
}

.langs__legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  margin-top: 10px;
  font-size: 0.85rem;
}

.langs__legend li {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.langs__legend i {
  width: 9px;
  height: 9px;
}

.langs__legend span {
  color: var(--muted);
}

.quest__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.forks {
  margin-top: 36px;
}

.forks__title {
  color: var(--muted);
  font-size: 0.82rem;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.forks ul {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 14px;
}

.forks a {
  display: grid;
  gap: 4px;
  height: 100%;
  padding: 14px 16px;
  border: 1px dashed var(--line-2);
  text-decoration: none;
  transition: border-color 0.15s;
}

.forks a:hover {
  border-color: var(--accent);
}

.forks strong {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font: 700 1rem/1.3 var(--font-display);
}

.forks a:hover strong {
  color: var(--accent);
}

.forks a > span {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 860px) {
  .quests,
  .forks ul,
  .quest--featured .quest__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .quest--featured .quest__body {
    gap: 16px;
  }
}
</style>
