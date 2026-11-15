# README

Portfolio site for Lalit Kumar Meena: a game-themed single page. The hero is a racing-game title screen where a car collects skills on a night drive; below it are a quest log for experience, an interactive skill tree, GitHub projects, and a playable mini-game for each hobby.

## Stack

- [Vue 3](https://vuejs.org/) single-file components, plain JavaScript
- [Three.js](https://threejs.org/) for the night drive in the hero
- [Vite](https://vite.dev/) for dev server and build
- Hand-written CSS, no UI framework
- [chess.js](https://github.com/jhlywa/chess.js) for the chess puzzles; fonts are self-hosted through Fontsource

## Commands

```powershell
npm install        # once
npm run dev        # dev server with hot reload
npm run build      # production build into dist/
npm run preview    # serve the production build locally
```

## Editing content

All text content lives in `src/data/`, so most updates need no component changes.

| File | Contents |
| --- | --- |
| `src/data/profile.js` | Name, role, company, domains, contact links, favourite games, signature skills |
| `src/data/experience.js` | Companies, roles, dates and objectives for the quest log (newest first) |
| `src/data/skills.js` | Skill groups, where each skill was used, and which skills appear in the hero |
| `src/data/projects.js` | Curated GitHub projects, language breakdowns and forks |
| `src/data/trophies.js` | Awards, certifications and education |
| `src/composables/useAchievements.js` | Visitor achievements unlocked by exploring the site |

The level shown in the HUD and the tenure of each role are computed from the dates in these files.
The portrait is `src/assets/lalit.jpg`.

The projects section refreshes star counts and "updated" dates from the public GitHub API in the browser, and adds a card for any new non-fork repository. If the API is unreachable it shows the snapshot from `src/data/projects.js`.

## Structure

```
src/
  App.vue                 page shell, Konami code
  components/             one component per section, plus shared pieces
  components/hobbies/     the five mini-games
  three/drive.js          Three.js night drive for the hero (loaded lazily)
  data/                   content
  styles/base.css         design tokens and shared classes
```

## Deploying

`npm run build` produces a static site in `dist/`. The build uses relative asset paths (`base: './'` in `vite.config.js`), so the same output works on a custom domain and under a sub-path such as `https://lalitmeena04.github.io/personal-portfolio/`.

Pushes to `main` are built and published to GitHub Pages by `.github/workflows/deploy.yml`. This needs the repository's Pages source (Settings → Pages) set to **GitHub Actions**; "Deploy from a branch" would serve the unbuilt source and show a blank page.
