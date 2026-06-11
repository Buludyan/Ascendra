import { useState } from 'react'

import { useDeveloperMachines } from '../../api/queries'
import { MachineCard } from './MachineCard'
import { MachineDetail } from './MachineDetail'

export function DeveloperDashboard() {
  const machinesQuery = useDeveloperMachines()
  const machines = machinesQuery.data ?? []
  const [selectedVmId, setSelectedVmId] = useState<string | null>(null)

  if (machinesQuery.isLoading) {
    return (
      <section className="grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            className="h-48 animate-pulse rounded-3xl bg-white/60 shadow-sm"
            key={item}
          />
        ))}
      </section>
    )
  }

  if (machinesQuery.isError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900">
        Failed to load your machines. Try refreshing the page.
      </section>
    )
  }

  if (machines.length === 0) {
    return (
      <section className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-10 text-center">
        <h2 className="text-2xl font-semibold">No developer machines yet</h2>
        <p className="mt-2 text-slate-600">
          Create your first workspace from an approved template.
        </p>
      </section>
    )
  }

  const selectedMachine =
    machines.find((machine) => machine.id === selectedVmId) ?? machines[0]

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-800">
          Developer workspace
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
          My machines
        </h2>
      </div>
      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
          {machines.map((machine) => (
            <MachineCard
              isSelected={machine.id === selectedMachine.id}
              key={machine.id}
              machine={machine}
              onSelect={setSelectedVmId}
            />
          ))}
        </div>
        <MachineDetail
          fallbackMachine={selectedMachine}
          vmId={selectedMachine.id}
        />
      </div>
    </section>
  )
}
