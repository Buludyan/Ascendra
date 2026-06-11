import type { WorkspacePersona } from '../../store/workspaceStore'
import { useWorkspaceStore } from '../../store/workspaceStore'

const personaOptions: {
  value: WorkspacePersona
  label: string
  description: string
}[] = [
  {
    value: 'developer',
    label: 'Developer',
    description: 'My machines',
  },
  {
    value: 'admin',
    label: 'Admin',
    description: 'Fleet control',
  },
]

export function PersonaSwitcher() {
  const persona = useWorkspaceStore((state) => state.persona)
  const setPersona = useWorkspaceStore((state) => state.setPersona)

  return (
    <div
      aria-label="Switch dashboard experience"
      className="grid gap-2 rounded-2xl border border-slate-800/10 bg-white/70 p-2 shadow-sm shadow-slate-950/5 backdrop-blur md:grid-cols-2"
      role="group"
    >
      {personaOptions.map((option) => {
        const isActive = option.value === persona

        return (
          <button
            aria-pressed={isActive}
            className={[
              'rounded-xl px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2',
              isActive
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
            ].join(' ')}
            key={option.value}
            onClick={() => setPersona(option.value)}
            type="button"
          >
            <span className="block text-sm font-semibold">{option.label}</span>
            <span
              className={[
                'block text-xs',
                isActive ? 'text-cyan-100' : 'text-slate-500',
              ].join(' ')}
            >
              {option.description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
