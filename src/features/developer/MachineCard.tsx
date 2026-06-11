import { Cpu, HardDrive, MemoryStick } from 'lucide-react'

import type { VMDetail, VMStatus } from '../../domain/types'

interface MachineCardProps {
  isSelected: boolean
  machine: VMDetail
  onSelect: (vmId: string) => void
}

const statusStyles: Record<VMStatus, string> = {
  running: 'bg-emerald-100 text-emerald-800',
  stopped: 'bg-slate-200 text-slate-700',
  starting: 'bg-amber-100 text-amber-800',
  stopping: 'bg-orange-100 text-orange-800',
  error: 'bg-red-100 text-red-800',
}

export function MachineCard({
  isSelected,
  machine,
  onSelect,
}: MachineCardProps) {
  return (
    <button
      aria-pressed={isSelected}
      className={[
        'cursor-pointer rounded-3xl border p-5 text-left shadow-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
        isSelected
          ? 'border-cyan-500 bg-white shadow-cyan-950/10'
          : 'border-slate-900/10 bg-white/80 shadow-slate-950/5 hover:border-slate-300 hover:bg-white',
      ].join(' ')}
      onClick={() => onSelect(machine.id)}
      type="button"
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
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            statusStyles[machine.status],
          ].join(' ')}
        >
          {machine.status}
        </span>
      </div>
      <dl className="mt-6 grid gap-3 text-sm">
        <Metric
          icon={<Cpu aria-hidden="true" size={16} />}
          label="CPU"
          value={machine.cpuUsagePercent}
        />
        <Metric
          icon={<MemoryStick aria-hidden="true" size={16} />}
          label="Memory"
          value={machine.memoryUsagePercent}
        />
        <Metric
          icon={<HardDrive aria-hidden="true" size={16} />}
          label="Disk"
          value={machine.diskUsagePercent}
        />
      </dl>
    </button>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <dt className="flex items-center gap-2 text-slate-600">
          {icon}
          {label}
        </dt>
        <dd className="font-semibold text-slate-950">{value}%</dd>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-cyan-600"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}
