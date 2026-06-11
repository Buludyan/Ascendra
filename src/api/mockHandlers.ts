import { delay, http, HttpResponse } from 'msw'

import {
  currentUserId,
  mockFleetUtilizationTrend,
  mockNowIso,
  mockPolicies,
  mockTemplates,
  mockUsers,
  mockVms,
  mockVmUsage,
} from './mockData'
import type {
  FleetUtilization,
  TemplateDraft,
  TemplateUpdate,
  VM,
  VMAction,
  VMDetail,
  VMStatus,
} from '../domain/types'

const networkDelayMs = 250
const mockNowMs = Date.parse(mockNowIso)
const activeStatuses: VMStatus[] = ['running', 'starting', 'stopping', 'error']
const vmStatuses: VMStatus[] = [
  'running',
  'stopped',
  'starting',
  'stopping',
  'error',
]
const vmActions: VMAction[] = ['start', 'stop', 'restart']

const vms = mockVms.map((vm) => ({ ...vm }))
let templates = mockTemplates.map((template) => ({
  ...template,
  preinstalledTools: [...template.preinstalledTools],
}))
let templateSequence = templates.length + 1

function isVmStatus(value: unknown): value is VMStatus {
  return typeof value === 'string' && vmStatuses.includes(value as VMStatus)
}

function isVmAction(value: unknown): value is VMAction {
  return typeof value === 'string' && vmActions.includes(value as VMAction)
}

function getOwner(ownerId: string) {
  return mockUsers.find((user) => user.id === ownerId) ?? mockUsers[0]
}

function getTemplate(templateId: string) {
  return (
    templates.find((template) => template.id === templateId) ?? templates[0]
  )
}

function calculateIdleMinutes(vm: VM) {
  return Math.max(
    0,
    Math.round((mockNowMs - Date.parse(vm.lastActiveAt)) / 60_000),
  )
}

function enrichVm(vm: VM): VMDetail {
  return {
    ...vm,
    owner: getOwner(vm.ownerId),
    template: getTemplate(vm.templateId),
    idleMinutes: calculateIdleMinutes(vm),
    usageTrend: mockVmUsage[vm.id] ?? [],
  }
}

function isActive(vm: VM) {
  return activeStatuses.includes(vm.status)
}

function isIdle(vm: VM) {
  return (
    vm.status === 'running' &&
    calculateIdleMinutes(vm) >= 120 &&
    vm.cpuUsagePercent < 10 &&
    vm.memoryUsagePercent < 35
  )
}

function isHot(vm: VM) {
  return vm.cpuUsagePercent >= 80 || vm.memoryUsagePercent >= 80
}

function buildFleetUtilization(): FleetUtilization {
  const activeVms = vms.filter(isActive)
  const cpuValues = activeVms.map((vm) => vm.cpuUsagePercent)
  const memoryValues = activeVms.map((vm) => vm.memoryUsagePercent)
  const totalHourlyCost = activeVms.reduce((total, vm) => total + vm.hourlyCost, 0)
  const avg = (values: number[]) =>
    values.length === 0
      ? 0
      : Math.round(values.reduce((total, value) => total + value, 0) / values.length)

  return {
    period: 'real-time',
    totalVms: vms.length,
    runningVms: vms.filter((vm) => vm.status === 'running').length,
    stoppedVms: vms.filter((vm) => vm.status === 'stopped').length,
    totalUsers: mockUsers.filter((user) => user.role === 'engineer').length,
    avgCpuUtilizationPercent: avg(cpuValues),
    peakCpuUtilizationPercent: Math.max(0, ...cpuValues),
    avgMemoryUtilizationPercent: avg(memoryValues),
    peakMemoryUtilizationPercent: Math.max(0, ...memoryValues),
    totalHourlyCost: Number(totalHourlyCost.toFixed(2)),
    monthToDateCost: Number((totalHourlyCost * 24 * 11).toFixed(2)),
    projectedMonthlyCost: Number((totalHourlyCost * 24 * 30).toFixed(2)),
    utilizationTrend: mockFleetUtilizationTrend,
    vmMetrics: vms.map((vm) => ({
      vmId: vm.id,
      cpuPercent: vm.cpuUsagePercent,
      memoryPercent: vm.memoryUsagePercent,
      diskPercent: vm.diskUsagePercent,
      status: vm.status,
    })),
  }
}

function filterAdminVms(url: URL) {
  const search = url.searchParams.get('search')?.trim().toLowerCase()
  const status = url.searchParams.get('status')
  const utilization = url.searchParams.get('utilization')

  return vms.filter((vm) => {
    const matchesSearch =
      !search ||
      [
        vm.name,
        vm.region,
        getOwner(vm.ownerId).name,
        getOwner(vm.ownerId).email,
        getTemplate(vm.templateId).name,
      ]
        .join(' ')
        .toLowerCase()
        .includes(search)

    const matchesStatus =
      !status || status === 'all' || (isVmStatus(status) && vm.status === status)

    const matchesUtilization =
      !utilization ||
      utilization === 'all' ||
      (utilization === 'idle' && isIdle(vm)) ||
      (utilization === 'hot' && isHot(vm))

    return matchesSearch && matchesStatus && matchesUtilization
  })
}

function createTemplateId() {
  const id = `template-custom-${templateSequence}`
  templateSequence += 1

  return id
}

export const handlers = [
  http.get('/api/health', async () => {
    await delay(120)

    return HttpResponse.json({
      status: 'ok',
    })
  }),

  http.get('/api/me', async () => {
    await delay(networkDelayMs)

    return HttpResponse.json(getOwner(currentUserId))
  }),

  http.get('/api/me/machines', async () => {
    await delay(networkDelayMs)

    return HttpResponse.json(
      vms.filter((vm) => vm.ownerId === currentUserId).map(enrichVm),
    )
  }),

  http.get('/api/vms/:id', async ({ params }) => {
    await delay(networkDelayMs)

    const vm = vms.find((item) => item.id === params.id)

    if (!vm) {
      return HttpResponse.json({ message: 'VM not found' }, { status: 404 })
    }

    return HttpResponse.json(enrichVm(vm))
  }),

  http.patch('/api/vms/:id/status', async ({ params, request }) => {
    await delay(networkDelayMs)

    const vmIndex = vms.findIndex((item) => item.id === params.id)

    if (vmIndex === -1) {
      return HttpResponse.json({ message: 'VM not found' }, { status: 404 })
    }

    const body = (await request.json().catch(() => ({}))) as {
      action?: unknown
      status?: unknown
    }

    const statusByAction: Record<VMAction, VMStatus> = {
      start: 'starting',
      stop: 'stopping',
      restart: 'starting',
    }

    const nextStatus = isVmStatus(body.status)
      ? body.status
      : isVmAction(body.action)
        ? statusByAction[body.action]
        : null

    if (!nextStatus) {
      return HttpResponse.json(
        { message: 'Expected a valid VM action or status' },
        { status: 400 },
      )
    }

    const currentVm = vms[vmIndex]
    const shouldSetStartedAt =
      nextStatus === 'starting' && currentVm.startedAt === null

    vms[vmIndex] = {
      ...currentVm,
      status: nextStatus,
      startedAt: shouldSetStartedAt ? mockNowIso : currentVm.startedAt,
      lastActiveAt: mockNowIso,
    }

    return HttpResponse.json(enrichVm(vms[vmIndex]))
  }),

  http.get('/api/admin/fleet', async () => {
    await delay(networkDelayMs)

    return HttpResponse.json(buildFleetUtilization())
  }),

  http.get('/api/admin/vms', async ({ request }) => {
    await delay(networkDelayMs)

    return HttpResponse.json(filterAdminVms(new URL(request.url)).map(enrichVm))
  }),

  http.get('/api/templates', async () => {
    await delay(networkDelayMs)

    return HttpResponse.json(templates)
  }),

  http.post('/api/templates', async ({ request }) => {
    await delay(networkDelayMs)

    const body = (await request.json()) as TemplateDraft
    const template = {
      ...body,
      id: createTemplateId(),
      preinstalledTools: [...body.preinstalledTools],
    }

    templates = [template, ...templates]

    return HttpResponse.json(template, { status: 201 })
  }),

  http.patch('/api/templates/:id', async ({ params, request }) => {
    await delay(networkDelayMs)

    const templateIndex = templates.findIndex((template) => template.id === params.id)

    if (templateIndex === -1) {
      return HttpResponse.json({ message: 'Template not found' }, { status: 404 })
    }

    const body = (await request.json()) as TemplateUpdate

    templates[templateIndex] = {
      ...templates[templateIndex],
      ...body,
      preinstalledTools:
        body.preinstalledTools ?? templates[templateIndex].preinstalledTools,
    }

    return HttpResponse.json(templates[templateIndex])
  }),

  http.get('/api/policies', async () => {
    await delay(networkDelayMs)

    return HttpResponse.json(mockPolicies)
  }),
]
