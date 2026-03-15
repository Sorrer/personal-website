export interface HexSkill {
  id: string
  name: string
  short: string
  connections: string[]
  load: number // 1-5 block bar level
}

export const techSkills: HexSkill[] = [
  { id: 'typescript', name: 'Typescript', short: 'TS', connections: ['nodejs', 'vue3', 'webdev', 'rest'], load: 5 },
  { id: 'nodejs', name: 'NodeJS', short: 'NODE', connections: ['typescript', 'rest', 'websockets', 'kafka'], load: 5 },
  { id: 'csharp', name: 'C#', short: 'C#', connections: ['unity', 'gamedev', 'dotnet'], load: 4 },
  { id: 'cpp', name: 'C++', short: 'C++', connections: ['c', 'gamedev', 'linux'], load: 4 },
  { id: 'c', name: 'C', short: 'C', connections: ['cpp', 'linux'], load: 3 },
  { id: 'kafka', name: 'Kafka', short: 'KAFK', connections: ['nodejs', 'services', 'docker'], load: 3 },
  { id: 'postgresql', name: 'PostgreSQL', short: 'PSQL', connections: ['nodejs', 'rest', 'services', 'docker'], load: 4 },
  { id: 'rest', name: 'REST', short: 'REST', connections: ['typescript', 'nodejs', 'webdev', 'postgresql'], load: 5 },
  { id: 'websockets', name: 'Websockets', short: 'WS', connections: ['nodejs', 'webdev', 'typescript'], load: 4 },
  { id: 'webdev', name: 'Web Dev', short: 'WEB', connections: ['typescript', 'vue3', 'rest', 'websockets'], load: 5 },
  { id: 'vue3', name: 'Vue3', short: 'VUE', connections: ['typescript', 'webdev'], load: 5 },
  { id: 'gamedev', name: 'Game Dev', short: 'GAME', connections: ['unity', 'csharp', 'cpp'], load: 4 },
  { id: 'unity', name: 'Unity', short: 'UNIT', connections: ['csharp', 'gamedev'], load: 4 },
  { id: 'java', name: 'Java', short: 'JAVA', connections: ['services', 'kafka', 'kubernetes'], load: 3 },
  { id: 'ghactions', name: 'Github Actions', short: 'GHA', connections: ['cicd_gl', 'docker', 'kubernetes'], load: 3 },
  { id: 'cicd_gl', name: 'Gitlab CI/CD', short: 'GLCI', connections: ['ghactions', 'docker', 'kubernetes'], load: 3 },
  { id: 'kubernetes', name: 'Kubernetes', short: 'K8S', connections: ['docker', 'services', 'linux'], load: 4 },
  { id: 'docker', name: 'Docker', short: 'DOCK', connections: ['kubernetes', 'linux', 'services'], load: 4 },
  { id: 'services', name: 'Services', short: 'SVC', connections: ['docker', 'kubernetes', 'kafka', 'rest'], load: 4 },
  { id: 'linux', name: 'Linux', short: 'LNX', connections: ['docker', 'kubernetes', 'c', 'cpp'], load: 4 },
  { id: 'go', name: 'Go', short: 'GO', connections: ['grpc', 'services', 'kubernetes', 'docker'], load: 4 },
  { id: 'grpc', name: 'gRPC', short: 'GRPC', connections: ['go', 'rust', 'services', 'rest'], load: 3 },
  { id: 'rust', name: 'Rust', short: 'RUST', connections: ['grpc', 'linux', 'c', 'cpp'], load: 3 },
  { id: 'python', name: 'Python', short: 'PY', connections: ['nodejs', 'rest', 'services'], load: 3 },
  { id: 'react', name: 'React', short: 'REAC', connections: ['typescript', 'webdev'], load: 3 },
  { id: 'gcp', name: 'GCP', short: 'GCP', connections: ['kubernetes', 'docker', 'services'], load: 3 },
  { id: 'nginx', name: 'Nginx', short: 'NGX', connections: ['linux', 'docker', 'services'], load: 3 },
  { id: 's3', name: 'S3', short: 'S3', connections: ['gcp', 'docker', 'services'], load: 3 },
]

// dotnet is a hidden connection target only (no node)
export const dotnetId = 'dotnet'

export const generalSkills: HexSkill[] = [
  { id: 'leadership', name: 'Leadership', short: 'LEAD', connections: ['mentor', 'projmgmt', 'organization'], load: 5 },
  { id: 'mentor', name: 'Mentor', short: 'MNTR', connections: ['leadership', 'problemsolving'], load: 4 },
  { id: 'organization', name: 'Organization', short: 'ORG', connections: ['projmgmt', 'timemgmt', 'leadership'], load: 5 },
  { id: 'projmgmt', name: 'Project Management', short: 'PM', connections: ['organization', 'scrum', 'sprints', 'leadership'], load: 5 },
  { id: 'problemsolving', name: 'Problem Solving', short: 'SOLV', connections: ['innovative', 'mentor', 'testing'], load: 5 },
  { id: 'innovative', name: 'Innovative', short: 'INNO', connections: ['problemsolving'], load: 4 },
  { id: 'timemgmt', name: 'Time Management', short: 'TIME', connections: ['organization', 'sprints'], load: 4 },
  { id: 'cicd', name: 'CI/CD', short: 'CICD', connections: ['devops', 'testing'], load: 4 },
  { id: 'devops', name: 'DevOps', short: 'DOPS', connections: ['cicd', 'testing'], load: 4 },
  { id: 'scrum', name: 'Scrum', short: 'SCRM', connections: ['sprints', 'projmgmt'], load: 4 },
  { id: 'sprints', name: 'Sprints', short: 'SPRT', connections: ['scrum', 'projmgmt', 'timemgmt'], load: 4 },
  { id: 'testing', name: 'Testing', short: 'TEST', connections: ['cicd', 'devops', 'problemsolving'], load: 4 },
  { id: 'aigenai', name: 'AI / GenAI', short: 'AI', connections: ['innovative', 'problemsolving'], load: 4 },
  { id: 'rapidproto', name: 'Rapid Prototyping', short: 'RPRO', connections: ['innovative', 'problemsolving', 'projmgmt'], load: 4 },
]

export interface HexPosition {
  id: string
  x: number
  y: number
}

/**
 * Compute pointy-top hex positions in a honeycomb grid.
 * Returns center coordinates for each skill.
 */
export function computeHexPositions(
  skills: HexSkill[],
  cols: number,
  hexWidth: number,
  hexHeight: number,
  offsetX: number = 0,
  offsetY: number = 0
): HexPosition[] {
  const positions: HexPosition[] = []
  const colSpacing = hexWidth * 0.88
  const rowSpacing = hexHeight * 0.82

  for (let i = 0; i < skills.length; i++) {
    const row = Math.floor(i / cols)
    const col = i % cols
    // Odd rows shift right by half a column
    const xShift = row % 2 === 1 ? colSpacing / 2 : 0
    positions.push({
      id: skills[i].id,
      x: offsetX + col * colSpacing + xShift,
      y: offsetY + row * rowSpacing,
    })
  }

  return positions
}
