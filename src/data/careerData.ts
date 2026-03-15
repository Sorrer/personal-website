export interface RoleSegment {
  title: string
  start: string
  end: string
}

export interface CareerEntry {
  id: string
  title: string
  role: string
  roles?: RoleSegment[]
  timestamp: string
  end: string
  summary: string
}

export interface Project {
  name: string
  careerId?: string
  roleTitle?: string
  founder?: boolean
  url?: string
  summary: string
  contributions: string[]
  tags: string[]
}

export const careerEntries: CareerEntry[] = [
  {
    id: 'rutgers',
    title: 'Rutgers',
    role: 'Bachelor of Sciences',
    timestamp: '2020.09',
    end: '2024.05',
    summary: 'Pursued a degree in Computer Science with focus on software engineering, algorithms, and systems design.',
  },
  {
    id: 'cogs',
    title: 'Creation of Games Society',
    role: 'President',
    timestamp: '2021.09',
    end: '2023.05',
    summary: 'Founded and led a university game development organization. Organized game jams, workshops, and collaborative projects fostering creative technical skills.',
  },
  {
    id: 'lightriver',
    title: 'LightRiver',
    role: 'Software Engineering Manager',
    roles: [
      { title: 'Software Engineer', start: '2023.06', end: '2024.06' },
      { title: 'Software Engineering Manager', start: '2024.06', end: '2026.03' },
    ],
    timestamp: '2023.06',
    end: '2026.03',
    summary: 'Built cloud-native network automation solutions. Led engineering teams, drove architecture decisions, and shaped technical strategy across multiple product lines.',
  },
  {
    id: 'next',
    title: '???',
    role: 'Initializing...',
    timestamp: '2026.??',
    end: '████████',
    summary: 'Something new is compiling. A fresh chapter is loading into memory — revealing SOON.',
  },
]

export const projects: Project[] = [
  {
    name: 'PRISM',
    careerId: 'lightriver',
    founder: true,
    url: 'https://lightriver.com/prism/',
    summary: 'An intelligent platform that visualizes, controls, and optimizes multi-vendor, multi-generation optical networks. PRISM provides real-time and historical insights into network performance, enabling operators to manage complex heterogeneous infrastructure through a unified interface.',
    contributions: [
      'Founded and led the project from inception to production',
      'Led engineering teams building the cloud-native, air-gapped, and on-prem platform architecture',
      'Drove technical strategy and architecture decisions across product lines',
      'Built scalable microservices for real-time network telemetry and control',
      'Implemented CI/CD pipelines and DevOps workflows for rapid delivery',
    ],
    tags: ['Vue3', 'TypeScript', 'Go', 'Rust', 'gRPC', 'Kubernetes', 'Kafka', 'PostgreSQL', 'REST'],
  },
  {
    name: 'netFLEX',
    careerId: 'lightriver',
    roleTitle: 'Software Engineer',
    url: 'https://lightriver.com/netflex/',
    summary: 'A vendor-neutral optical domain controller for automating and orchestrating multi-vendor, multi-generation transport networks via SDN.',
    contributions: [
      'Built and maintained core platform services and APIs',
      'Developed network visualization and real-time inventory features',
    ],
    tags: ['TypeScript', 'Vue3', 'REST', 'PostgreSQL', 'Docker', 'Kubernetes'],
  },
  {
    name: 'ClawTree',
    founder: true,
    url: 'https://github.com/Sorrer/ClawTree',
    summary: 'A terminal user interface for managing Git worktrees with integrated Claude Code sessions. Enables parallel AI-assisted development across multiple branches with session persistence, prompt queuing, and vim-style navigation.',
    contributions: [
      'Designed and built the full TUI application from scratch',
      'Implemented worktree lifecycle management with live Git status tracking',
      'Built multi-session Claude Code integration with tmux-based persistence',
      'Created prompt queue system for sequential one-shot task execution',
      'Shipped cross-platform support for Linux, macOS, and WSL',
    ],
    tags: ['Rust', 'Git', 'TUI', 'Claude Code', 'tmux'],
  },
]

/** Look up the career entry linked to a project */
export function getCareerForProject(project: Project): CareerEntry | undefined {
  return careerEntries.find(e => e.id === project.careerId)
}
