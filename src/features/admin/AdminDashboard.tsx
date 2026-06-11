import { FleetOverview } from './FleetOverview'
import { FleetUtilization } from './FleetUtilization'
import { TemplatesPanel } from './TemplatesPanel'
import { VmInventory } from './VmInventory'

export function AdminDashboard() {
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
      <FleetOverview />
      <FleetUtilization />
      <VmInventory />
      <TemplatesPanel />
    </section>
  )
}
