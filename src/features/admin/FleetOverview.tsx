import { Activity, DollarSign, Server, Users } from 'lucide-react'

import { useFleetUtilization } from '../../api/queries'

export function FleetOverview() {
  const fleetQuery = useFleetUtilization()
  const fleet = fleetQuery.data

  if (fleetQuery.isLoading) {
    return (
      <section className="grid gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            className="h-36 animate-pulse rounded-3xl bg-white/60 shadow-sm"
            key={item}
          />
        ))}
      </section>
    )
  }

  if (fleetQuery.isError || !fleet) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900">
        Failed to load fleet overview.
      </section>
    )
  }

  return (
    <section className="grid gap-4 lg:grid-cols-4">
      <SummaryCard
        detail={`${fleet.stoppedVms} stopped · ${fleet.totalVms} total`}
        icon={<Server aria-hidden="true" size={18} />}
        label="VMs running"
        value={String(fleet.runningVms)}
      />
      <SummaryCard
        detail="engineers with active workspace access"
        icon={<Users aria-hidden="true" size={18} />}
        label="Users"
        value={String(fleet.totalUsers)}
      />
      <SummaryCard
        detail={`${fleet.peakCpuUtilizationPercent}% CPU peak · ${fleet.avgMemoryUtilizationPercent}% memory avg`}
        icon={<Activity aria-hidden="true" size={18} />}
        label="Aggregate CPU"
        value={`${fleet.avgCpuUtilizationPercent}%`}
      />
      <SummaryCard
        detail={`$${fleet.monthToDateCost} month to date`}
        icon={<DollarSign aria-hidden="true" size={18} />}
        label="Infra cost"
        value={`$${fleet.totalHourlyCost}/hr`}
      />
    </section>
  )
}

function SummaryCard({
  detail,
  icon,
  label,
  value,
}: {
  detail: string
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <article className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5">
      <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
        {icon}
        {label}
      </div>
      <strong className="mt-4 block text-3xl font-semibold tracking-[-0.03em] text-slate-950">
        {value}
      </strong>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  )
}
