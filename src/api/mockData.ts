import type {
  FleetUtilization,
  Policy,
  User,
  VM,
  VMTemplate,
  VMUsagePoint,
} from '../domain/types'

export const mockNowIso = '2026-06-11T12:00:00.000Z'

export const currentUserId = 'user-eng-1'

const mockNowMs = Date.parse(mockNowIso)

function minutesAgo(minutes: number) {
  return new Date(mockNowMs - minutes * 60 * 1000).toISOString()
}

function hoursAgo(hours: number) {
  return minutesAgo(hours * 60)
}

function daysAgo(days: number) {
  return hoursAgo(days * 24)
}

function clampPercent(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)))
}

function buildUsageTrend(cpuBase: number, memoryBase: number): VMUsagePoint[] {
  return Array.from({ length: 12 }, (_, index) => {
    const timestamp = hoursAgo((11 - index) * 2)
    const wave = ((index % 5) - 2) * 4

    return {
      timestamp,
      cpuPercent: clampPercent(cpuBase + wave + index * 0.8),
      memoryPercent: clampPercent(memoryBase + wave * 0.6 + index * 0.5),
    }
  })
}

export const mockUsers: User[] = [
  {
    id: currentUserId,
    name: 'Maya Chen',
    email: 'maya.chen@ascendra.test',
    role: 'engineer',
    vmCount: 3,
  },
  {
    id: 'user-eng-2',
    name: 'Narek Aramyan',
    email: 'narek.aramyan@ascendra.test',
    role: 'engineer',
    vmCount: 2,
  },
  {
    id: 'user-eng-3',
    name: 'Priya Shah',
    email: 'priya.shah@ascendra.test',
    role: 'engineer',
    vmCount: 1,
  },
  {
    id: 'user-eng-4',
    name: 'Jon Bell',
    email: 'jon.bell@ascendra.test',
    role: 'engineer',
    vmCount: 1,
  },
  {
    id: 'user-admin-1',
    name: 'Elena Ford',
    email: 'elena.ford@ascendra.test',
    role: 'admin',
    vmCount: 0,
  },
]

export const mockTemplates: VMTemplate[] = [
  {
    id: 'template-frontend',
    name: 'Frontend Pro',
    description: 'React, Node, browser tooling, and vscode-server for UI teams.',
    baseImage: 'ubuntu-24.04',
    vCpu: 4,
    memoryGb: 16,
    diskSizeGb: 120,
    preinstalledTools: ['vscode-server', 'node', 'pnpm', 'docker'],
  },
  {
    id: 'template-backend',
    name: 'Backend Build',
    description: 'Balanced image for services, containers, and API development.',
    baseImage: 'ubuntu-22.04',
    vCpu: 8,
    memoryGb: 32,
    diskSizeGb: 200,
    preinstalledTools: ['vscode-server', 'docker', 'go', 'postgresql-client'],
  },
  {
    id: 'template-ml',
    name: 'ML Sandbox',
    description: 'High-memory workspace for notebooks and model experiments.',
    baseImage: 'ubuntu-22.04-cuda',
    vCpu: 16,
    memoryGb: 64,
    diskSizeGb: 400,
    preinstalledTools: ['vscode-server', 'python', 'jupyter', 'cuda'],
  },
  {
    id: 'template-mobile',
    name: 'Mobile CI Lab',
    description: 'Android build tools and device emulation support.',
    baseImage: 'ubuntu-22.04',
    vCpu: 8,
    memoryGb: 24,
    diskSizeGb: 250,
    preinstalledTools: ['vscode-server', 'android-sdk', 'node', 'java'],
  },
]

export const mockVms: VM[] = [
  {
    id: 'vm-101',
    name: 'maya-frontend-main',
    ownerId: currentUserId,
    templateId: 'template-frontend',
    status: 'running',
    region: 'us-east-1',
    createdAt: daysAgo(18),
    startedAt: hoursAgo(6),
    lastActiveAt: minutesAgo(7),
    cpuUsagePercent: 46,
    memoryUsagePercent: 61,
    diskUsagePercent: 43,
    hourlyCost: 0.42,
  },
  {
    id: 'vm-102',
    name: 'maya-api-spike',
    ownerId: currentUserId,
    templateId: 'template-backend',
    status: 'starting',
    region: 'us-west-2',
    createdAt: daysAgo(4),
    startedAt: minutesAgo(2),
    lastActiveAt: minutesAgo(2),
    cpuUsagePercent: 18,
    memoryUsagePercent: 29,
    diskUsagePercent: 22,
    hourlyCost: 0.78,
  },
  {
    id: 'vm-103',
    name: 'maya-ui-review',
    ownerId: currentUserId,
    templateId: 'template-frontend',
    status: 'stopped',
    region: 'eu-central-1',
    createdAt: daysAgo(27),
    startedAt: null,
    lastActiveAt: daysAgo(5),
    cpuUsagePercent: 0,
    memoryUsagePercent: 0,
    diskUsagePercent: 35,
    hourlyCost: 0,
  },
  {
    id: 'vm-201',
    name: 'narek-services-01',
    ownerId: 'user-eng-2',
    templateId: 'template-backend',
    status: 'running',
    region: 'us-east-1',
    createdAt: daysAgo(33),
    startedAt: hoursAgo(11),
    lastActiveAt: minutesAgo(18),
    cpuUsagePercent: 82,
    memoryUsagePercent: 74,
    diskUsagePercent: 58,
    hourlyCost: 0.78,
  },
  {
    id: 'vm-202',
    name: 'narek-load-test',
    ownerId: 'user-eng-2',
    templateId: 'template-ml',
    status: 'error',
    region: 'us-east-2',
    createdAt: daysAgo(9),
    startedAt: hoursAgo(3),
    lastActiveAt: hoursAgo(2),
    cpuUsagePercent: 94,
    memoryUsagePercent: 88,
    diskUsagePercent: 71,
    hourlyCost: 1.62,
  },
  {
    id: 'vm-301',
    name: 'priya-ml-notebook',
    ownerId: 'user-eng-3',
    templateId: 'template-ml',
    status: 'running',
    region: 'us-west-2',
    createdAt: daysAgo(12),
    startedAt: hoursAgo(8),
    lastActiveAt: minutesAgo(42),
    cpuUsagePercent: 67,
    memoryUsagePercent: 79,
    diskUsagePercent: 64,
    hourlyCost: 1.62,
  },
  {
    id: 'vm-401',
    name: 'jon-mobile-build',
    ownerId: 'user-eng-4',
    templateId: 'template-mobile',
    status: 'stopping',
    region: 'eu-west-1',
    createdAt: daysAgo(21),
    startedAt: hoursAgo(4),
    lastActiveAt: hoursAgo(1),
    cpuUsagePercent: 14,
    memoryUsagePercent: 28,
    diskUsagePercent: 49,
    hourlyCost: 0.96,
  },
  {
    id: 'vm-402',
    name: 'jon-idle-preview',
    ownerId: 'user-eng-4',
    templateId: 'template-frontend',
    status: 'running',
    region: 'us-east-1',
    createdAt: daysAgo(5),
    startedAt: hoursAgo(9),
    lastActiveAt: hoursAgo(5),
    cpuUsagePercent: 3,
    memoryUsagePercent: 12,
    diskUsagePercent: 17,
    hourlyCost: 0.42,
  },
]

export const mockPolicies: Policy[] = [
  {
    id: 'policy-default-engineering',
    name: 'Default engineering quota',
    maxVmsPerUser: 3,
    idleTimeoutMinutes: 120,
    allowedTemplateIds: ['template-frontend', 'template-backend'],
    appliesToTeam: 'Engineering',
    createdAt: daysAgo(60),
  },
  {
    id: 'policy-ml-lab',
    name: 'ML lab exception',
    maxVmsPerUser: 2,
    idleTimeoutMinutes: 60,
    allowedTemplateIds: ['template-ml'],
    appliesToTeam: 'Applied AI',
    createdAt: daysAgo(22),
  },
]

export const mockVmUsage: Record<string, VMUsagePoint[]> = Object.fromEntries(
  mockVms.map((vm) => [
    vm.id,
    buildUsageTrend(vm.cpuUsagePercent, vm.memoryUsagePercent),
  ]),
)

export const mockFleetUtilizationTrend: FleetUtilization['utilizationTrend'] =
  Array.from({ length: 12 }, (_, index) => ({
    timestamp: hoursAgo((11 - index) * 2),
    cpuPercent: clampPercent(42 + ((index % 4) - 1) * 6 + index * 1.2),
    memoryPercent: clampPercent(51 + ((index % 3) - 1) * 5 + index),
    runningVms: 4 + (index % 3),
  }))
