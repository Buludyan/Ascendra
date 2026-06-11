import type { ReactNode } from 'react'
import { Activity, ServerCog } from 'lucide-react'

import { useCurrentUser } from '../../api/queries'
import { PersonaSwitcher } from './PersonaSwitcher'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const currentUserQuery = useCurrentUser()
  const currentUserName = currentUserQuery.data?.name

  return (
    <div className="min-h-screen bg-[#f3f0e8] text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(8,145,178,0.22),_transparent_30%),linear-gradient(135deg,_rgba(15,23,42,0.08),_transparent_45%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-5 border-b border-slate-900/10 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-cyan-200 shadow-lg shadow-slate-950/20">
              <ServerCog aria-hidden="true" size={24} />
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.24em] text-cyan-800">
                <Activity aria-hidden="true" size={15} />
                Ascendra Workspaces
              </p>
              <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl">
                Developer machines without infrastructure guesswork.
              </h1>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-2xl border border-slate-900/10 bg-white/70 px-4 py-3 text-sm shadow-sm shadow-slate-950/5">
              <span className="block text-xs uppercase tracking-[0.18em] text-slate-500">
                Signed in
              </span>
              <span className="font-semibold text-slate-900">
                {currentUserQuery.isLoading
                  ? 'Loading account...'
                  : currentUserQuery.isError
                    ? 'Account unavailable'
                    : currentUserName}
              </span>
            </div>
            <PersonaSwitcher />
          </div>
        </header>
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  )
}
