import { monthsInclusive } from '../utils/dates'

export const profile = {
  name: 'Lalit Kumar Meena',
  role: 'Software Engineer II',
  company: 'Bentley Systems',
  location: 'Pune, India',
  email: 'lalitmeena04@outlook.com',
  phone: '+91 9407240431',
  github: 'https://github.com/lalitmeena04',
  githubHandle: 'lalitmeena04',
  linkedin: 'https://www.linkedin.com/in/lalitmeena',
  linkedinHandle: 'in/lalitmeena',
  careerStart: '2021-10',
  domains: ['Infrastructure engineering software', 'Digital twins'],
  education: 'B.E. Computer Science & Engineering, RGPV Bhopal · 2020',
  hobbies: ['Gaming', 'Football', 'Chess', 'Anime', 'Manga'],
  favouriteGames: [
    'NFS Most Wanted (2005)',
    'FIFA',
    'Valorant',
    'Fortnite',
    'Apex Legends',
    "Assassin's Creed",
    'GTA',
    'Call of Duty',
    'Battlefield',
  ],
}

// One level per completed year of professional experience.
const completedMonths = monthsInclusive(profile.careerStart) - 1
export const level = Math.floor(completedMonths / 12)
export const levelProgress = (completedMonths % 12) / 12

// The skills to lead with on the profile. `id` matches a skill in skills.js, so each card opens it in the skill tree.
export const signatureSkills = [
  { id: 'cpp', name: 'C++', tone: 'accent', label: 'My main language across defence consoles, embedded displays and infrastructure software.' },
  { id: 'qt', name: 'Qt & QML', tone: 'mp', label: 'Rebuilt an electronic-warfare HMI in Qt 5, and ship Qt 6 desktop apps of my own.' },
  { id: 'three', name: 'Three.js & 3D', tone: 'gold', label: 'Brought interactive 3D into a simulator for real-time sensor data.' },
  { id: 'genai', name: 'GenAI workflows', tone: 'hp', label: 'Automation scripts designed and maintained with GenAI inside the development workflow.' },
]
