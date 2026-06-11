import { DollarSign, Server, Users } from 'lucide-react'

import {
  useAdminVms,
  useFleetUtilization,
  useTemplates,
} from '../../api/queries'

export function AdminDashboard() {
  const fleetQuery = useFleetUtilization()
  const adminVmsQuery = useAdminVms()
  const templatesQuery = useTemplates()
  const fleet = fleetQuery.data
  const adminVms = adminVmsQuery.data ?? []
  const templates = templatesQuery.data ?? []

  if (fleetQuery.isLoading || adminVmsQuery.isLoading || templatesQuery.isLoading) {
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

  if (fleetQuery.isError || adminVmsQuery.isError || templatesQuery.isError) {
    return (
      <section className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-900">
        Failed to load fleet data. Check the mock API and try again.
      </section>
    )
  }

  if (!fleet) {
    return null
  }

  const idleVms = adminVms.filter((vm) => vm.idleMinutes >= 120)
  const hotVms = adminVms.filter(
    (vm) => vm.cpuUsagePercent >= 80 || vm.memoryUsagePercent >= 80,
  )

  return (
    <section className="space-y-5">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-800">
          Admin control plane
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em]">
          Fleet overview
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-4">
        <SummaryCard
          icon={<Server aria-hidden="true" size={18} />}
          label="VMs"
          value={`${fleet.runningVms}/${fleet.totalVms}`}
          detail={`${fleet.stoppedVms} stopped`}
        />
        <SummaryCard
          icon={<Users aria-hidden="true" size={18} />}
          label="Users"
          value={String(fleet.totalUsers)}
          detail="engineers with workspaces"
        />
        <SummaryCard
          icon={<Server aria-hidden="true" size={18} />}
          label="Utilization"
          value={`${fleet.avgCpuUtilizationPercent}% CPU`}
          detail={`${fleet.avgMemoryUtilizationPercent}% memory avg`}
        />
        <SummaryCard
          icon={<DollarSign aria-hidden="true" size={18} />}
          label="Cost"
          value={`$${fleet.totalHourlyCost}/hr`}
          detail={`$${fleet.projectedMonthlyCost} projected`}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5">
          <h3 className="text-lg font-semibold">Inventory signal</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Signal label="Total inventory" value={adminVms.length} />
            <Signal label="Hot VMs" value={hotVms.length} />
            <Signal label="Idle VMs" value={idleVms.length} />
          </div>
        </article>
        <article className="rounded-3xl border border-slate-900/10 bg-slate-950 p-5 text-white shadow-sm shadow-slate-950/10">
          <h3 className="text-lg font-semibold">Templates</h3>
          <p className="mt-2 text-sm text-slate-300">
            {templates.length} approved VM templates are ready for
            engineers.
          </p>
        </article>
      </div>
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

function Signal({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4">
      <span className="block text-sm text-slate-500">{label}</span>
      <strong className="mt-2 block text-2xl font-semibold text-slate-950">
        {value}
      </strong>
    </div>
  )
}
