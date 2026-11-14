const repoUrl = (name) => `https://github.com/lalitmeena04/${name}`

// Curated copy for the main repositories. Stars and "updated" dates are refreshed live from the
// GitHub API when it is reachable; the values here are the fallback snapshot.
export const projects = [
  {
    repo: 'MediaFlyouts',
    title: 'MediaFlyouts',
    kind: 'Featured side quest',
    featured: true,
    tagline: 'Fluent-styled flyouts and taskbar widgets for Windows, built with Qt 6, C++ and QML.',
    description:
      'Replaces the dated Windows media and volume popups and adds lock-key, now-playing, peripheral-battery and charger flyouts, plus a taskbar widget stack.',
    highlights: [
      'Media and volume flyouts with album art, transport controls and a per-app mixer.',
      'Taskbar widgets with a live audio visualizer: bars, radial, waveform and beat-driven particles.',
      'Battery monitoring over Bluetooth Classic / LE, Fast Pair, DualSense, Razer and Logitech.',
      'Ships as an installer, a portable ZIP and on the Microsoft Store.',
    ],
    languages: [
      ['C++', 960897],
      ['QML', 273468],
      ['Python', 74802],
      ['PowerShell', 67790],
      ['CMake', 28617],
      ['JavaScript', 11829],
    ],
    stars: 1,
    pushedAt: '2026-11-12',
    links: [
      { label: 'Source', href: repoUrl('MediaFlyouts') },
      { label: 'Download', href: 'https://lalitmeena04.github.io/MediaFlyouts-Releases/' },
    ],
  },
  {
    repo: 'AULA-F75-Studio',
    title: 'AULA F75 Studio',
    kind: 'Side quest · Hardware',
    tagline: 'An open-source companion app and alternative driver for the AULA F75 mechanical keyboard.',
    description: '',
    highlights: [
      "Speaks the keyboard's own HID protocol directly over USB feature reports. Nothing touches the network.",
      '18 lighting effects with an animated preview, a per-key canvas, and audio-reactive and CPU/GPU heatmap modes.',
      'Key remapping on the Base and Fn layers, timed macro recording, local profiles and a Game mode.',
    ],
    languages: [
      ['C++', 207713],
      ['QML', 96030],
      ['PowerShell', 21451],
      ['CMake', 9364],
    ],
    stars: 1,
    pushedAt: '2026-10-26',
    links: [{ label: 'Source', href: repoUrl('AULA-F75-Studio') }],
  },
  {
    repo: 'leet',
    title: 'LEET',
    kind: 'Side quest · Desktop + ML',
    tagline: 'Lecture Engagement Evaluation Tool.',
    description: '',
    highlights: [
      'Electron desktop app with Vue 2 and Vuetify dashboards for classes and faculty.',
      'Flask backend with a face-analysis pipeline built on Keras and TensorFlow.',
    ],
    languages: [
      ['Vue', 36771],
      ['Python', 34709],
      ['JavaScript', 7411],
      ['HTML', 1042],
    ],
    stars: 0,
    pushedAt: '2023-09-03',
    links: [{ label: 'Source', href: repoUrl('leet') }],
  },
]

export const forks = [
  { name: 'rea', description: 'Reverse engineer anything with agents, from app behavior down to native binaries.', href: repoUrl('rea') },
  { name: 'gods-eye-view', description: 'Live open-source spatial intelligence on a photorealistic 3D globe.', href: repoUrl('gods-eye-view') },
]

// Repositories that should not appear as their own card.
export const hiddenRepos = ['personal-portfolio', 'MediaFlyouts-Releases', 'lalitmeena04']

export const languageColors = {
  'C++': '#f34b7d',
  QML: '#44a51c',
  Python: '#3572a5',
  PowerShell: '#5391fe',
  CMake: '#da3434',
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#8a63d2',
  Other: '#6b7280',
}
