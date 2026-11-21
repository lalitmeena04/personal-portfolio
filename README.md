# README

Portfolio site for Lalit Kumar Meena: a game-themed single page. The hero is a racing-game title screen where a car collects skills on a night drive; below it are a quest log for experience, an interactive skill tree, GitHub projects, and a playable mini-game for each hobby.

## Stack

- [Vue 3](https://vuejs.org/) single-file components in [TypeScript](https://www.typescriptlang.org/)
- [Three.js](https://threejs.org/) for the night drive in the hero
- [Vite](https://vite.dev/) for dev server and build
- Hand-written CSS, no UI framework
- [chess.js](https://github.com/jhlywa/chess.js) for the chess puzzles; fonts are self-hosted through Fontsource
- [ESLint](https://eslint.org/), [Prettier](https://prettier.io/) and [Vitest](https://vitest.dev/) for linting, formatting and unit tests

## Commands

Needs Node.js 22.13 or newer.

```powershell
npm install        # once
npm run dev        # dev server with hot reload
npm run build      # type-check, then production build into dist/
npm run preview    # serve the production build locally
npm run check      # everything CI runs: lint, format check, type-check and tests
npm run format     # format every file with Prettier
```

`check` runs `lint`, `format:check`, `type-check` and `test`, which can also be run on their own.

## Editing content

All text content lives in `src/data/`, so most updates need no component changes.

| File                                 | Contents                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `src/data/profile.ts`                | Name, role, company, domains, contact links, favourite games, signature skills |
| `src/data/experience.ts`             | Companies, roles, dates and objectives for the quest log (newest first)        |
| `src/data/skills.ts`                 | Skill groups, where each skill was used, and which skills appear in the hero   |
| `src/data/projects.ts`               | Curated GitHub projects, language breakdowns and forks                         |
| `src/data/trophies.ts`               | Awards, certifications and education                                           |
| `src/composables/useAchievements.ts` | Visitor achievements unlocked by exploring the site                            |

Each file exports a type for its entries, so a missing or misspelt field fails `npm run type-check`.

The level shown in the HUD and the tenure of each role are computed from the dates in these files.
The portrait is `src/assets/lalit.jpg`.

The projects section refreshes star counts and "updated" dates from the public GitHub API in the browser, and adds a card for any new non-fork repository. If the API is unreachable it shows the snapshot from `src/data/projects.ts`.

## Structure

```
src/
  App.vue                 page shell
  components/             one component per section, plus shared pieces
  components/hobbies/     the seven mini-games
  composables/            visitor achievements, Konami code
  three/drive.ts          Three.js night drive for the hero (loaded lazily)
  data/                   content
  utils/                  date maths, press-and-hold button helper
  styles/base.css         design tokens and shared classes
```

Unit tests sit next to the code they cover as `*.test.ts`.

## Deploying

`npm run build` produces a static site in `dist/`. The build uses relative asset paths (`base: './'` in `vite.config.ts`), so the same output works on a custom domain and under a sub-path such as `https://lalitmeena04.github.io/personal-portfolio/`.

Pushes to `main` are checked, built and published to GitHub Pages by `.github/workflows/deploy.yml`; a failing check stops the deploy. Pull requests get the same checks from `.github/workflows/ci.yml`. Publishing needs the repository's Pages source (Settings → Pages) set to **GitHub Actions**; "Deploy from a branch" would serve the unbuilt source and show a blank page.

The footer's global visit badge is provided by [Visitor Badge](https://visitorbadge.io). It counts badge requests across visitors and requires the hosted service to be available; requests are made from the browser, with no API key or backend required.
