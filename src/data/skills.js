const quest = (id, label) => ({ kind: 'quest', id, label })
const project = (id, label = id) => ({ kind: 'project', id, label })
const note = (label) => ({ kind: 'note', label })

const BENTLEY = quest('bentley', 'Bentley Systems')
const DELTA = quest('delta', 'Delta IoT Solutions')
const TASL = quest('tasl', 'TATA Advanced Systems')
const MEDIA = project('MediaFlyouts')
const AULA = project('AULA-F75-Studio', 'AULA F75 Studio')
const LEET = project('leet', 'LEET')
const SITE = note('This site')

// `used` lists where each skill has actually been applied; it drives the "battle-tested in" links.
export const skillGroups = [
  {
    title: 'Domains',
    skills: [
      {
        id: 'infra',
        name: 'Infrastructure engineering software',
        blurb: 'My current domain at Bentley Systems.',
        used: [BENTLEY],
      },
      { id: 'twins', name: 'Digital twins', blurb: 'My current domain, alongside infrastructure engineering software.', used: [BENTLEY] },
      {
        id: 'hmi',
        name: 'Defence HMI & simulation',
        blurb: 'Operator consoles for an electronic-warfare system and a 3D simulator for real-time sensor data.',
        used: [TASL],
      },
      { id: 'embedded', name: 'Embedded displays', blurb: 'Display software for agricultural equipment.', used: [DELTA] },
    ],
  },
  {
    title: 'Languages',
    skills: [
      {
        id: 'cpp',
        name: 'C++',
        blurb: 'My main. Every role so far has run on it: defence HMIs, embedded displays, and the Windows apps I build for fun.',
        used: [BENTLEY, DELTA, TASL, MEDIA, AULA],
      },
      { id: 'c', name: 'C', blurb: 'Where C++ ends and the hardware begins.', used: [] },
      {
        id: 'js',
        name: 'JavaScript',
        blurb: 'My second language: 3D scenes at work, a desktop dashboard, and everything that moves on this page.',
        used: [TASL, LEET, SITE],
      },
      {
        id: 'web',
        name: 'HTML & CSS',
        blurb: 'Hand-written. There is no UI kit on this page.',
        used: [project('MediaFlyouts', 'MediaFlyouts download site'), SITE],
      },
      {
        id: 'qml',
        name: 'QML',
        blurb: 'Declarative UI for Qt 6. Every screen in MediaFlyouts and AULA F75 Studio is written in it.',
        used: [MEDIA, AULA],
      },
    ],
  },
  {
    title: 'Frameworks',
    skills: [
      {
        id: 'qt',
        name: 'Qt',
        blurb: 'From a Qt 5 electronic-warfare HMI to Qt 6 desktop apps shipped on the Microsoft Store.',
        used: [TASL, MEDIA, AULA, note('Udemy certification, 2022')],
      },
      {
        id: 'three',
        name: 'Three.js',
        blurb: 'Brought a 3D simulation scenario into a desktop application. It also draws the night drive at the top of this page.',
        used: [TASL, SITE],
      },
      {
        id: 'vue',
        name: 'Vue',
        blurb: 'Vue 2 for the LEET desktop dashboard, Vue 3 for this portfolio.',
        used: [LEET, SITE],
      },
    ],
  },
  {
    title: 'Libraries & Build',
    skills: [
      { id: 'gsoap', name: 'gSOAP', blurb: 'SOAP web-service bindings for C++ systems.', used: [TASL] },
      { id: 'opendds', name: 'OpenDDS', blurb: 'Publish–subscribe messaging for real-time data distribution.', used: [TASL] },
      { id: 'cmake', name: 'CMake', blurb: 'Presets, Ninja and CI builds for my Qt 6 projects.', used: [MEDIA, AULA] },
    ],
  },
  {
    title: 'Databases',
    skills: [
      { id: 'mysql', name: 'MySQL', blurb: 'Relational storage from my TATA Advanced Systems toolkit.', used: [TASL] },
      { id: 'sybase', name: 'Sybase', blurb: 'Enterprise relational database from the same toolkit.', used: [TASL] },
    ],
  },
  {
    title: 'Workflow',
    skills: [
      { id: 'git', name: 'Git', blurb: 'Everything I ship lives in a repository.', used: [BENTLEY, DELTA, TASL, MEDIA, AULA, LEET] },
      { id: 'bitbucket', name: 'Bitbucket', blurb: 'Team repository hosting.', used: [TASL] },
      { id: 'jenkins', name: 'Jenkins', blurb: 'CI/CD pipelines.', used: [] },
      { id: 'jira', name: 'Jira', blurb: 'Issue and sprint tracking.', used: [TASL] },
      {
        id: 'genai',
        name: 'GenAI workflows',
        blurb: 'Used GenAI inside the development workflow to design and maintain automation scripts, for about 90% less manual effort.',
        used: [DELTA],
      },
    ],
  },
  {
    title: 'Platforms',
    skills: [
      { id: 'qtcreator', name: 'Qt Creator', blurb: 'Home base for Qt work.', used: [] },
      {
        id: 'unreal',
        name: 'Unreal Engine',
        blurb: 'Certified in C++ for Unreal game development. This is where the day job meets the hobby.',
        used: [note('Coursera certification, 2023')],
      },
    ],
  },
  {
    title: 'Scripting',
    skills: [
      { id: 'powershell', name: 'PowerShell', blurb: 'Build, packaging and release scripts for my Windows apps.', used: [MEDIA, AULA] },
      { id: 'bash', name: 'Bash', blurb: 'Shell glue for builds and tooling.', used: [] },
    ],
  },
]

export const allSkills = skillGroups.flatMap((group) => group.skills.map((skill) => ({ ...skill, group: group.title })))

// Skills that come down the road as pickups in the hero and fill its loadout panel, in this order.
const HERO_SKILL_IDS = ['cpp', 'qt', 'qml', 'twins', 'three', 'js', 'vue', 'unreal', 'cmake', 'git', 'powershell', 'opendds', 'gsoap', 'mysql']
export const heroSkills = HERO_SKILL_IDS.map((id) => allSkills.find((skill) => skill.id === id))
