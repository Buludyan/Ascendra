import { Cpu, HardDrive, MemoryStick, Play } from 'lucide-react'

import { useDeveloperMachines } from '../../api/queries'

export function DeveloperDashboard() {
  const machinesQuery = useDeveloperMachines()
  const machines = machinesQuery.data ?? []

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
      <div className="grid gap-4 lg:grid-cols-3">
        {machines.map((machine) => (
          <article
            className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5"
            key={machine.id}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-slate-950">
                  {machine.name}
                </h3>
                <p className="text-sm text-slate-500">
                  {machine.template.name} · {machine.region}
                </p>
              </div>
              <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-900">
                {machine.status}
              </span>
            </div>
            <dl className="mt-6 grid gap-3 text-sm">
              <Metric
                icon={<Cpu aria-hidden="true" size={16} />}
                label="CPU"
                value={`${machine.cpuUsagePercent}%`}
              />
              <Metric
                icon={<MemoryStick aria-hidden="true" size={16} />}
                label="Memory"
                value={`${machine.memoryUsagePercent}%`}
              />
              <Metric
                icon={<HardDrive aria-hidden="true" size={16} />}
                label="Disk"
                value={`${machine.diskUsagePercent}%`}
              />
            </dl>
            <a
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              href={`https://vscode.ascendra.test/workspaces/${machine.id}`}
              target="_blank"
            >
              <Play aria-hidden="true" size={16} />
              Open in IDE
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-3 py-2">
      <dt className="flex items-center gap-2 text-slate-600">
        {icon}
        {label}
      </dt>
      <dd className="font-semibold text-slate-950">{value}</dd>
    </div>
  )
}
