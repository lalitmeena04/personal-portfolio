// Newest first. `start` / `end` are 'YYYY-MM'; `end: null` marks the current role.
export const quests = [
  {
    id: 'bentley',
    company: 'Bentley Systems',
    location: 'Pune, India',
    start: '2026-09',
    end: null,
    period: 'Sep 2026 – Present',
    brief: 'The current main quest: C++ development for infrastructure engineering software and digital twins.',
    ranks: [
      {
        title: 'Software Engineer II',
        period: 'Sep 2026 – Present',
        objectives: [
          'Developing and debugging C++ application software in the infrastructure engineering and digital twin domain.',
          'Focused on system functionality and seamless application performance.',
          'Quest in progress — more objectives unlock as they ship.',
        ],
      },
    ],
    loot: ['C++', 'Infrastructure engineering software', 'Digital twins', 'Debugging'],
  },
  {
    id: 'delta',
    company: 'Delta IoT Solutions',
    location: 'Pune, India',
    start: '2025-02',
    end: '2026-09',
    period: 'Feb 2025 – Sep 2026',
    brief: 'Embedded display software for a confidential global agricultural-equipment OEM.',
    ranks: [
      {
        title: 'Senior C++ Developer',
        period: 'Feb 2025 – Sep 2026',
        objectives: [
          'Developed embedded display software for a confidential global agricultural-equipment OEM.',
          'Brought GenAI into the development workflow to design and maintain automation scripts, cutting manual effort by ~90%.',
          'Built an integration platform that runs system health checks and prevents unplanned downtime, saving ~$200K a year.',
          'Established coding best practices and ran thorough code reviews.',
        ],
      },
    ],
    loot: ['C++', 'Embedded displays', 'GenAI automation', 'Code reviews'],
  },
  {
    id: 'tasl',
    company: 'TATA Advanced Systems',
    location: 'Mumbai, India',
    start: '2021-10',
    end: '2025-02',
    period: 'Oct 2021 – Feb 2025',
    brief: 'Defence HMIs and simulation. Four performance-based promotions in 3.5 years.',
    ranks: [
      {
        title: 'Senior Executive',
        period: 'Apr 2024 – Feb 2025',
        objectives: [
          'Built a 3D simulator prototype that visualises real-time sensor data from an anti-artillery system.',
          'Integrated a 3D simulation scenario with Three.js, adding interactive visuals to the application.',
          'Redesigned the task-creation pipeline, improving load times by ~65%.',
          'Led on-site acceptance testing at the client location and coordinated system integration with multiple vendors.',
          'Established SOPs for system integration and seamless deployments.',
        ],
      },
      {
        title: 'Executive',
        period: 'Oct 2022 – Mar 2024',
        objectives: [
          'Overhauled the HMI of the Integrated Electronic Warfare System in Qt 5, raising usability and performance by ~80%.',
          'Developed an offline analysis tool that extended the HMI for detailed analysis.',
          'Built an internal tool that generates application assets from raw data, removing a large manual step.',
        ],
      },
      {
        title: 'Graduate Engineer Trainee',
        period: 'Oct 2021 – Sep 2022',
        objectives: [
          'Cut HMI load time by ~45% with multithreading.',
          'Ran a code-optimisation pass that reduced complexity and redundancy and made the codebase easier to maintain.',
        ],
      },
    ],
    loot: ['C++', 'Qt 5', 'Three.js', 'JavaScript', 'gSOAP', 'OpenDDS', 'MySQL', 'Sybase', 'Multithreading'],
  },
]
