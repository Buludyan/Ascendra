export type VMStatus = 'running' | 'stopped' | 'starting' | 'stopping' | 'error'

export type VMAction = 'start' | 'stop' | 'restart'

export type UserRole = 'engineer' | 'admin'

export interface VM {
  id: string
  name: string
  ownerId: string
  templateId: string
  status: VMStatus
  region: string
  createdAt: string
  startedAt: string | null
  lastActiveAt: string
  cpuUsagePercent: number
  memoryUsagePercent: number
  diskUsagePercent: number
  hourlyCost: number
}

export interface VMTemplate {
  id: string
  name: string
  description: string
  baseImage: string
  vCpu: number
  memoryGb: number
  diskSizeGb: number
  preinstalledTools: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  vmCount: number
}

export interface Policy {
  id: string
  name: string
  maxVmsPerUser: number
  idleTimeoutMinutes: number
  allowedTemplateIds: string[]
  appliesToTeam?: string
  createdAt: string
}

export interface VMUsagePoint {
  timestamp: string
  cpuPercent: number
  memoryPercent: number
}

export interface VMDetail extends VM {
  owner: User
  template: VMTemplate
  idleMinutes: number
  usageTrend: VMUsagePoint[]
}

export interface FleetUtilization {
  period: 'real-time' | 'last-24-hours' | 'last-30-days'
  totalVms: number
  runningVms: number
  stoppedVms: number
  totalUsers: number
  avgCpuUtilizationPercent: number
  peakCpuUtilizationPercent: number
  avgMemoryUtilizationPercent: number
  peakMemoryUtilizationPercent: number
  totalHourlyCost: number
  monthToDateCost: number
  projectedMonthlyCost: number
  utilizationTrend: {
    timestamp: string
    cpuPercent: number
    memoryPercent: number
    runningVms: number
  }[]
  vmMetrics: {
    vmId: string
    cpuPercent: number
    memoryPercent: number
    diskPercent: number
    status: VMStatus
  }[]
}

export type TemplateDraft = Omit<VMTemplate, 'id'>

export type TemplateUpdate = Partial<TemplateDraft>

export interface VmInventoryFilters {
  search?: string
  status?: VMStatus | 'all'
  utilization?: 'all' | 'idle' | 'hot'
}
