import { describe, expect, it } from 'vitest'

import { api } from './client'

describe('api client', () => {
  it('checks mock API health', async () => {
    await expect(api.health()).resolves.toEqual({ status: 'ok' })
  })

  it('loads the current developer machines through MSW', async () => {
    const machines = await api.getDeveloperMachines()

    expect(machines).toHaveLength(3)
    expect(machines[0]).toHaveProperty('template')
    expect(machines[0]).toHaveProperty('usageTrend')
  })

  it('updates VM status through the mock backend', async () => {
    const updatedVm = await api.updateVmStatus('vm-103', 'start')

    expect(updatedVm.status).toBe('starting')
    expect(updatedVm.startedAt).not.toBeNull()
  })
})
