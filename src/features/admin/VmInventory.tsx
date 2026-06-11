import { useMemo, useState } from 'react'
import { AlertTriangle, Search } from 'lucide-react'

import { useAdminVms } from '../../api/queries'
import type { VMDetail, VMStatus, VmInventoryFilters } from '../../domain/types'

const statuses: Array<VMStatus | 'all'> = [
  'all',
  'running',
  'starting',
  'stopping',
  'stopped',
  'error',
]

const utilizationFilters: Array<Required<VmInventoryFilters>['utilization']> = [
  'all',
  'hot',
  'idle',
]

const statusStyles: Record<VMStatus, string> = {
  running: 'bg-emerald-100 text-emerald-800',
  stopped: 'bg-slate-200 text-slate-700',
  starting: 'bg-amber-100 text-amber-800',
  stopping: 'bg-orange-100 text-orange-800',
  error: 'bg-red-100 text-red-800',
}

export function VmInventory() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<VMStatus | 'all'>('all')
  const [utilization, setUtilization] =
    useState<Required<VmInventoryFilters>['utilization']>('all')

  const filters = useMemo(
    () => ({
      search,
      status,
      utilization,
    }),
    [search, status, utilization],
  )
  const adminVmsQuery = useAdminVms(filters)
  const vms = adminVmsQuery.data ?? []

  return (
    <section className="rounded-3xl border border-slate-900/10 bg-white/80 p-5 shadow-sm shadow-slate-950/5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">VM inventory</h3>
          <p className="mt-1 text-sm text-slate-500">
            Search across owners, templates, regions, and machine names.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(220px,1fr)_160px_160px]">
          <label className="relative">
            <span className="sr-only">Search VMs</span>
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={17}
            />
            <input
              className="h-11 w-full rounded-2xl border border-slate-900/10 bg-white pl-10 pr-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search VMs..."
              type="search"
              value={search}
            />
          </label>
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              className="h-11 w-full cursor-pointer rounded-2xl border border-slate-900/10 bg-white px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              onChange={(event) => setStatus(event.target.value as VMStatus | 'all')}
              value={status}
            >
              {statuses.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filter by utilization</span>
            <select
              className="h-11 w-full cursor-pointer rounded-2xl border border-slate-900/10 bg-white px-3 text-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              onChange={(event) =>
                setUtilization(
                  event.target.value as Required<VmInventoryFilters>['utilization'],
                )
              }
              value={utilization}
            >
              {utilizationFilters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {adminVmsQuery.isLoading ? (
        <div className="mt-5 grid gap-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="h-16 animate-pulse rounded-2xl bg-slate-100"
              key={item}
            />
          ))}
        </div>
      ) : null}

      {adminVmsQuery.isError ? (
        <div className="mt-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
          Failed to load inventory.
        </div>
      ) : null}

      {!adminVmsQuery.isLoading && !adminVmsQuery.isError && vms.length === 0 ? (
        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-8 text-center">
          <h4 className="font-semibold text-slate-950">No VMs match filters</h4>
          <p className="mt-1 text-sm text-slate-500">
            Adjust search, status, or utilization filters.
          </p>
        </div>
      ) : null}

      {vms.length > 0 ? (
        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-900/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Machine</th>
                  <th className="px-4 py-3 font-semibold">Owner</th>
                  <th className="px-4 py-3 font-semibold">Template</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">CPU</th>
                  <th className="px-4 py-3 font-semibold">Memory</th>
                  <th className="px-4 py-3 font-semibold">Disk</th>
                  <th className="px-4 py-3 font-semibold">Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {vms.map((vm) => (
                  <InventoryRow key={vm.id} vm={vm} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function InventoryRow({ vm }: { vm: VMDetail }) {
  const signal = getVmSignal(vm)

  return (
    <tr className="align-middle">
      <td className="px-4 py-3">
        <div className="font-semibold text-slate-950">{vm.name}</div>
        <div className="text-xs text-slate-500">{vm.region}</div>
      </td>
      <td className="px-4 py-3">
        <div className="font-medium text-slate-800">{vm.owner.name}</div>
        <div className="text-xs text-slate-500">{vm.owner.email}</div>
      </td>
      <td className="px-4 py-3 text-slate-600">{vm.template.name}</td>
      <td className="px-4 py-3">
        <span
          className={[
            'rounded-full px-3 py-1 text-xs font-semibold',
            statusStyles[vm.status],
          ].join(' ')}
        >
          {vm.status}
        </span>
      </td>
      <td className="px-4 py-3 font-semibold text-slate-900">
        {vm.cpuUsagePercent}%
      </td>
      <td className="px-4 py-3 font-semibold text-slate-900">
        {vm.memoryUsagePercent}%
      </td>
      <td className="px-4 py-3 font-semibold text-slate-900">
        {vm.diskUsagePercent}%
      </td>
      <td className="px-4 py-3">
        <span
          className={[
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
            signal.className,
          ].join(' ')}
        >
          {signal.showIcon ? <AlertTriangle aria-hidden="true" size={13} /> : null}
          {signal.label}
        </span>
      </td>
    </tr>
  )
}

function getVmSignal(vm: VMDetail) {
  if (vm.status === 'error') {
    return {
      className: 'bg-red-100 text-red-800',
      label: 'error',
      showIcon: true,
    }
  }

  if (vm.cpuUsagePercent >= 80 || vm.memoryUsagePercent >= 80) {
    return {
      className: 'bg-orange-100 text-orange-800',
      label: 'hot',
      showIcon: true,
    }
  }

  if (
    vm.status === 'running' &&
    vm.idleMinutes >= 120 &&
    vm.cpuUsagePercent < 10
  ) {
    return {
      className: 'bg-emerald-100 text-emerald-800',
      label: 'idle',
      showIcon: false,
    }
  }

  return {
    className: 'bg-slate-100 text-slate-600',
    label: 'normal',
    showIcon: false,
  }
}
