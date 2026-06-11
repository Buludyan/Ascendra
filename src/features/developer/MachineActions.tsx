import { useState } from 'react'
import { Power, RefreshCw, Square } from 'lucide-react'

import { useUpdateVmStatus } from '../../api/queries'
import type { VMAction, VMDetail } from '../../domain/types'

interface MachineActionsProps {
  machine: VMDetail
}

const actionLabels: Record<VMAction, string> = {
  start: 'Start',
  stop: 'Stop',
  restart: 'Restart',
}

export function MachineActions({ machine }: MachineActionsProps) {
  const [pendingAction, setPendingAction] = useState<VMAction | null>(null)
  const updateVmStatus = useUpdateVmStatus()
  const isTransitioning =
    machine.status === 'starting' || machine.status === 'stopping'
  const availableActions = getAvailableActions(machine.status)

  function runAction(action: VMAction) {
    setPendingAction(action)
    updateVmStatus.mutate(
      {
        action,
        vmId: machine.id,
      },
      {
        onSettled: () => setPendingAction(null),
      },
    )
  }

  if (isTransitioning) {
    return (
      <div className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-900">
        {machine.status === 'starting'
          ? 'Machine is starting. Controls will unlock shortly.'
          : 'Machine is stopping. Controls will unlock shortly.'}
      </div>
    )
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {availableActions.map((action) => {
        const isPending = updateVmStatus.isPending && pendingAction === action

        return (
          <button
            className={[
              'inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
              action === 'stop'
                ? 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                : 'border-slate-900/10 bg-white text-slate-900 hover:bg-slate-100',
              updateVmStatus.isPending ? 'cursor-not-allowed opacity-70' : '',
            ].join(' ')}
            disabled={updateVmStatus.isPending}
            key={action}
            onClick={() => runAction(action)}
            type="button"
          >
            {getActionIcon(action)}
            {isPending ? `${actionLabels[action]}ing...` : actionLabels[action]}
          </button>
        )
      })}
    </div>
  )
}

function getAvailableActions(status: VMDetail['status']): VMAction[] {
  if (status === 'running') {
    return ['stop', 'restart']
  }

  if (status === 'stopped' || status === 'error') {
    return ['start']
  }

  return []
}

function getActionIcon(action: VMAction) {
  if (action === 'start') {
    return <Power aria-hidden="true" size={16} />
  }

  if (action === 'stop') {
    return <Square aria-hidden="true" size={16} />
  }

  return <RefreshCw aria-hidden="true" size={16} />
}
