import { lazy, Suspense } from 'react'
import { Flame, Leaf, ServerCrash } from 'lucide-react'

import { useAdminVms, useFleetUtilization } from '../../api/queries'

const UtilizationAreaChart = lazy(() =>
  import('../../components/charts/UtilizationAreaChart').then((module) => ({
    default: module.UtilizationAreaChart,
  })),
)

export function FleetUtilization() {
  const fleetQuery = useFleetUtilization()
  const adminVmsQuery = useAdminVms()
  const fleet = fleetQuery.data
  const adminVms = adminVmsQuery.data ?? []

  if (fleetQuery.isLoading || adminVmsQuery.isLoading) {
    return (
      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="h-96 animate-pulse rounded-3xl bg-white/60 shadow-sm" />
        <div className="h-96 animate-pulse rounded-3xl bg-white/60 shadow-sm" />
      </section>
    )
  }

  if (fleetQuery.isError || adminVmsQuery.isError || !fleet) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900">
        Failed to load fleet utilization.
      </section>
    )
  }

  const hotVms = adminVms.filter(
    (vm) => vm.cpuUsagePercent >= 80 || vm.memoryUsagePercent >= 80,
  )
  const idleVms = adminVms.filter(
    (vm) =>
      vm.status === 'running' &&
      vm.idleMinutes >= 120 &&
      vm.cpuUsagePercent < 10,
  )
  const problemVms = adminVms.filter((vm) => vm.status === 'error')

  return (
    <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
      <article className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-950">
              Fleet utilization
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Aggregate CPU and memory across running workspaces.
            </p>
          </div>
          <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900">
            {fleet.period}
          </span>
        </div>
        <div className="mt-5">
          <Suspense
            fallback={
              <div className="h-72 animate-pulse rounded-3xl bg-slate-100" />
            }
          >
            <UtilizationAreaChart data={fleet.utilizationTrend} />
          </Suspense>
        </div>
      </article>

      <article className="rounded-3xl border border-slate-900/10 bg-slate-950 p-5 text-white shadow-sm shadow-slate-950/10">
        <h3 className="text-lg font-semibold">Distribution signals</h3>
        <p className="mt-1 text-sm text-slate-300">
          Quickly separate waste, pressure, and operational risk.
        </p>
        <div className="mt-5 grid gap-3">
          <Signal
            detail="CPU or memory above 80%"
            icon={<Flame aria-hidden="true" size={17} />}
            label="Hot VMs"
            value={hotVms.length}
          />
          <Signal
            detail="Running but inactive for 2h+"
            icon={<Leaf aria-hidden="true" size={17} />}
            label="Idle VMs"
            value={idleVms.length}
          />
          <Signal
            detail="Needs admin attention"
            icon={<ServerCrash aria-hidden="true" size={17} />}
            label="Error state"
            value={problemVms.length}
          />
        </div>
      </article>
    </section>
  )
}

function Signal({
  detail,
  icon,
  label,
  value,
}: {
  detail: string
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-cyan-100">
        {icon}
        {label}
      </div>
      <strong className="mt-3 block text-3xl font-semibold">{value}</strong>
      <p className="mt-1 text-sm text-slate-300">{detail}</p>
    </div>
  )
}
