// src/data/team.js
// Seed data for the directory. New members added through the UI are held
// in React state (see useTeamDirectory) and merged with this list at runtime.

const team = [
  {
    id: 'm-1',
    name: 'Amara Chen',
    role: 'Engineering Lead',
    age: 34,
    isAdmin: true,
    skills: ['React', 'System Design', 'TypeScript', 'Mentorship'],
    address: { city: 'Seattle', country: 'USA' },
  },
  {
    id: 'm-2',
    name: 'Diego Fernandez',
    role: 'Backend Engineer',
    age: 29,
    isAdmin: false,
    skills: ['Node.js', 'PostgreSQL', 'Docker'],
    address: { city: 'Madrid', country: 'Spain' },
  },
  {
    id: 'm-3',
    name: 'Priya Nair',
    role: 'Product Designer',
    age: 27,
    isAdmin: false,
    skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping'],
    address: { city: 'Bengaluru', country: 'India' },
  },
  {
    id: 'm-4',
    name: 'Lucas Meyer',
    role: 'DevOps Lead',
    age: 38,
    isAdmin: true,
    skills: ['Kubernetes', 'AWS', 'CI/CD'],
    address: { city: 'Berlin', country: 'Germany' },
  },
  {
    id: 'm-5',
    name: 'Hannah Whitfield',
    role: 'QA Engineer',
    age: 31,
    isAdmin: false,
    skills: ['Cypress', 'Test Automation', 'Jest'],
    address: { city: 'Manchester', country: 'United Kingdom' },
  },
  {
    id: 'm-6',
    name: 'Kenji Watanabe',
    role: 'Frontend Engineer',
    age: 25,
    isAdmin: false,
    skills: ['React', 'CSS Architecture', 'Accessibility', 'Vite'],
    address: { city: 'Osaka', country: 'Japan' },
  },
  {
    id: 'm-7',
    name: 'Olusegun Adeyemi',
    role: 'Engineering Manager',
    age: 41,
    isAdmin: true,
    skills: ['Roadmapping', 'React', 'Team Leadership'],
    address: { city: 'Lagos', country: 'Nigeria' },
  },
];

export default team;
