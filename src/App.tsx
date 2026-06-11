import { AppShell } from './components/layout/AppShell'
import { AdminDashboard } from './features/admin/AdminDashboard'
import { DeveloperDashboard } from './features/developer/DeveloperDashboard'
import { useWorkspaceStore } from './store/workspaceStore'

function App() {
  const persona = useWorkspaceStore((state) => state.persona)

  return (
    <AppShell>
      {persona === 'developer' ? <DeveloperDashboard /> : <AdminDashboard />}
    </AppShell>
  )
}

export default App
