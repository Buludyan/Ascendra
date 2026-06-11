import {
  Calendar,
  Clock3,
  ExternalLink,
  HardDrive,
  MapPin,
  Microchip,
  TimerReset,
} from 'lucide-react'
import { lazy, Suspense } from 'react'

import { useVm } from '../../api/queries'
import type { VMDetail } from '../../domain/types'
import { MachineActions } from './MachineActions'

const UsageLineChart = lazy(() =>
  import('../../components/charts/UsageLineChart').then((module) => ({
    default: module.UsageLineChart,
  })),
)

interface MachineDetailProps {
  fallbackMachine: VMDetail
  vmId: string
}

export function MachineDetail({ fallbackMachine, vmId }: MachineDetailProps) {
  const vmQuery = useVm(vmId)
  const machine = vmQuery.data ?? fallbackMachine

  return (
    <aside className="rounded-[2rem] border border-slate-900/10 bg-white/90 p-5 shadow-sm shadow-slate-950/5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-cyan-800">
            VM detail
          </p>
          <h3 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950">
            {machine.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {machine.template.description}
          </p>
        </div>
        <a
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
          href={`https://vscode.ascendra.test/workspaces/${machine.id}`}
          target="_blank"
        >
          Open in IDE
          <ExternalLink aria-hidden="true" size={16} />
        </a>
      </div>

      {vmQuery.isError ? (
        <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          Could not refresh VM detail. Showing the latest cached machine data.
        </div>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Spec
          icon={<Microchip aria-hidden="true" size={16} />}
          label="Template"
          value={`${machine.template.vCpu} vCPU · ${machine.template.memoryGb} GB RAM`}
        />
        <Spec
          icon={<HardDrive aria-hidden="true" size={16} />}
          label="Disk"
          value={`${machine.template.diskSizeGb} GB · ${machine.template.baseImage}`}
        />
        <Spec
          icon={<MapPin aria-hidden="true" size={16} />}
          label="Region"
          value={machine.region}
        />
        <Spec
          icon={<Clock3 aria-hidden="true" size={16} />}
          label="Idle"
          value={`${machine.idleMinutes} minutes`}
        />
        <Spec
          icon={<TimerReset aria-hidden="true" size={16} />}
          label="Started"
          value={
            machine.startedAt ? formatDateTime(machine.startedAt) : 'Not running'
          }
        />
        <Spec
          icon={<Calendar aria-hidden="true" size={16} />}
          label="Created"
          value={formatDateTime(machine.createdAt)}
        />
      </div>

      <div className="mt-6">
        <MachineActions machine={machine} />
      </div>

      <section className="mt-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-lg font-semibold text-slate-950">
              CPU and memory over time
            </h4>
            <p className="text-sm text-slate-500">
              Last 24 hours, sampled every two hours.
            </p>
          </div>
          {vmQuery.isFetching ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
              Refreshing
            </span>
          ) : null}
        </div>
        <Suspense
          fallback={
            <div className="h-64 animate-pulse rounded-3xl bg-slate-100" />
          }
        >
          <UsageLineChart data={machine.usageTrend} />
        </Suspense>
      </section>
    </aside>
  )
}

function Spec({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl bg-slate-100 px-4 py-3">
      <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-2 text-sm font-semibold text-slate-950">{value}</dd>
    </div>
  )
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
