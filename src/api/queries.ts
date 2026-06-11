import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { api } from './client'
import type {
  TemplateDraft,
  TemplateUpdate,
  VMAction,
  VmInventoryFilters,
} from '../domain/types'

export const queryKeys = {
  currentUser: ['current-user'] as const,
  developerMachines: ['developer', 'machines'] as const,
  vm: (vmId: string) => ['vm', vmId] as const,
  fleetUtilization: ['admin', 'fleet-utilization'] as const,
  adminVms: (filters?: VmInventoryFilters) => ['admin', 'vms', filters] as const,
  templates: ['templates'] as const,
  policies: ['policies'] as const,
}

export function useCurrentUser() {
  return useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: api.getCurrentUser,
  })
}

export function useDeveloperMachines() {
  return useQuery({
    queryKey: queryKeys.developerMachines,
    queryFn: api.getDeveloperMachines,
  })
}

export function useVm(vmId: string) {
  return useQuery({
    queryKey: queryKeys.vm(vmId),
    queryFn: () => api.getVm(vmId),
  })
}

export function useFleetUtilization() {
  return useQuery({
    queryKey: queryKeys.fleetUtilization,
    queryFn: api.getFleetUtilization,
  })
}

export function useAdminVms(filters?: VmInventoryFilters) {
  return useQuery({
    queryKey: queryKeys.adminVms(filters),
    queryFn: () => api.getAdminVms(filters),
  })
}

export function useTemplates() {
  return useQuery({
    queryKey: queryKeys.templates,
    queryFn: api.getTemplates,
  })
}

export function useCreateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (template: TemplateDraft) => api.createTemplate(template),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.templates,
      })
    },
  })
}

export function useUpdateTemplate() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      template,
      templateId,
    }: {
      template: TemplateUpdate
      templateId: string
    }) => api.updateTemplate(templateId, template),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.templates,
      })
    },
  })
}

export function useUpdateVmStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ action, vmId }: { action: VMAction; vmId: string }) =>
      api.updateVmStatus(vmId, action),
    onSuccess: (vm) => {
      queryClient.setQueryData(queryKeys.vm(vm.id), vm)
      void queryClient.invalidateQueries({
        queryKey: queryKeys.developerMachines,
      })
      void queryClient.invalidateQueries({
        queryKey: queryKeys.fleetUtilization,
      })
      void queryClient.invalidateQueries({
        queryKey: ['admin', 'vms'],
      })
    },
  })
}
