import type {
  FleetUtilization,
  Policy,
  TemplateDraft,
  TemplateUpdate,
  User,
  VMAction,
  VMDetail,
  VMTemplate,
  VMStatus,
  VmInventoryFilters,
} from '../domain/types'

type JsonRequestInit = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function apiRequest<T>(path: string, options: JsonRequestInit = {}) {
  const { body, headers, ...requestOptions } = options
  const requestHeaders = new Headers(headers)

  if (body !== undefined) {
    requestHeaders.set('Content-Type', 'application/json')
  }

  const response = await fetch(path, {
    ...requestOptions,
    headers: requestHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`

    try {
      const errorBody = (await response.json()) as { message?: string }
      message = errorBody.message ?? message
    } catch {
      // Temporary empty
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

function buildQuery(filters?: VmInventoryFilters) {
  const searchParams = new URLSearchParams()

  if (filters?.search) {
    searchParams.set('search', filters.search)
  }

  if (filters?.status && filters.status !== 'all') {
    searchParams.set('status', filters.status)
  }

  if (filters?.utilization && filters.utilization !== 'all') {
    searchParams.set('utilization', filters.utilization)
  }

  const query = searchParams.toString()

  return query ? `?${query}` : ''
}

export const api = {
  health: () => apiRequest<{ status: 'ok' }>('/api/health'),

  getCurrentUser: () => apiRequest<User>('/api/me'),

  getDeveloperMachines: () => apiRequest<VMDetail[]>('/api/me/machines'),

  getVm: (vmId: string) => apiRequest<VMDetail>(`/api/vms/${vmId}`),

  updateVmStatus: (vmId: string, action: VMAction) =>
    apiRequest<VMDetail>(`/api/vms/${vmId}/status`, {
      method: 'PATCH',
      body: { action },
    }),

  setVmStatus: (vmId: string, status: VMStatus) =>
    apiRequest<VMDetail>(`/api/vms/${vmId}/status`, {
      method: 'PATCH',
      body: { status },
    }),

  getFleetUtilization: () =>
    apiRequest<FleetUtilization>('/api/admin/fleet'),

  getAdminVms: (filters?: VmInventoryFilters) =>
    apiRequest<VMDetail[]>(`/api/admin/vms${buildQuery(filters)}`),

  getTemplates: () => apiRequest<VMTemplate[]>('/api/templates'),

  createTemplate: (template: TemplateDraft) =>
    apiRequest<VMTemplate>('/api/templates', {
      method: 'POST',
      body: template,
    }),

  updateTemplate: (templateId: string, template: TemplateUpdate) =>
    apiRequest<VMTemplate>(`/api/templates/${templateId}`, {
      method: 'PATCH',
      body: template,
    }),

  getPolicies: () => apiRequest<Policy[]>('/api/policies'),
}
