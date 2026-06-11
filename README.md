# Ascendra Workspaces Dashboard

A frontend dashboard for managing cloud developer machines. The project covers two distinct product surfaces:

- Developer workspace: engineers manage and connect to their own machines.
- Admin control plane: DevOps/DevEx teams monitor fleet health, utilization, cost, inventory, and templates.

## Run Locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

Useful commands:

```bash
npm run lint
npm run build
npm test
```

## Tech Stack

- React, TypeScript, Vite
- Tailwind CSS for styling
- TanStack Query for async server state and cache invalidation
- Zustand for small UI state, currently the active persona
- MSW for the mock backend
- Recharts for utilization charts
- Radix UI Dialog for accessible template create/edit flows
- Vitest and React Testing Library for tests

I kept Vite instead of migrating to Next.js because this assignment is a dashboard SPA with a 4-6 hour time box. Vite is also listed in the role tooling, and it keeps the focus on product thinking, API integration, dashboard UX, and implementation quality.

## Product Interpretation

The brief describes two audiences with different jobs to be done:

- Developers want speed and personal context. They care about their own machines, whether they are usable, current resource usage, and a direct path into the browser IDE.
- Admins care about the fleet as infrastructure. They need aggregate health, utilization, cost, waste detection, hot machines, idle machines, and template governance.

I treated these as two different surfaces inside one product rather than one generic dashboard with role-based content hidden inside the same screen. The top-level switcher makes the distinction explicit while keeping the test app easy to explore.

## Information Architecture

Developer area:

- My Machines
- VM status and current CPU, memory, disk usage
- VM detail panel
- Lifecycle controls: start, stop, restart
- Browser IDE entry point
- CPU and memory trend

Admin area:

- Fleet overview metrics
- Fleet utilization chart
- Distribution signals for hot, idle, and error VMs
- Searchable and filterable VM inventory
- Template list
- Template create/edit dialog

Navigation is intentionally simple: a persona switcher in the app header toggles between Developer and Admin. In a production app this would likely be role-aware after authentication, but for the assignment it keeps both experiences visible.

## Key Flows Prioritized

Developer flow:

1. See all personal machines.
2. Select a machine.
3. Check resource usage and metadata.
4. Open the browser IDE.
5. Start, stop, or restart the VM and see transition states.

Admin flow:

1. Understand fleet state from summary metrics.
2. Inspect aggregate CPU and memory utilization over time.
3. Identify hot, idle, and error machines.
4. Search/filter the VM inventory.
5. Review and update VM templates.

I prioritized these because they map directly to the core requirement split: personal workspace productivity for developers, and infrastructure health/efficiency for admins.

## Mock Backend

The UI does not import mock arrays directly. Components call hooks built on TanStack Query, which call a typed API client, which uses `fetch`. MSW intercepts those requests and returns mock API responses.

Main endpoints:

- `GET /api/me`
- `GET /api/me/machines`
- `GET /api/vms/:id`
- `PATCH /api/vms/:id/status`
- `GET /api/admin/fleet`
- `GET /api/admin/vms`
- `GET /api/templates`
- `POST /api/templates`
- `PATCH /api/templates/:id`
- `GET /api/policies`

The mock backend keeps VM and template state in memory during the session, so lifecycle and template actions behave like real async operations.

## Design Decisions

- The Developer view uses cards and a focused detail panel because the primary task is operating one machine at a time.
- The Admin view is denser: metrics, charts, filters, and tables are more important than large cards.
- Loading, error, and empty states are included for key data surfaces.
- Charts are lazy-loaded to keep the initial bundle smaller.
- Lifecycle controls are disabled while a VM is in `starting` or `stopping`, which prevents conflicting actions during transitions.
- Idle VMs are surfaced as a cost/waste signal; hot VMs are surfaced as a capacity/health signal.

## Trade-Offs

- Authentication is not implemented. The current user is mocked through `/api/me`.
- VM status transitions stop at transitional states like `starting` and `stopping`; a real product would complete transitions through polling, SSE, or WebSockets.
- The mock backend is in-memory only, so state resets on reload.
- Template validation is intentionally lightweight.
- Admin policy management is modeled in the API data, but not built as a full screen.
- The app uses one route with a persona switcher instead of a full router to keep the implementation focused.

## With More Time

- Add real routing and role-aware auth using OAuth/OIDC.
- Add WebSocket or SSE simulation for live VM metrics and status changes.
- Add Playwright E2E coverage for developer lifecycle and admin template flows.
- Add a policy management screen for quotas, resource limits, and idle auto-stop.
- Add Storybook for reusable dashboard components.
- Add stronger form validation and optimistic UI for mutations.
- Deploy to Vercel or Netlify and add the URL here.

## Deployment

Deployment URL: https://ascendra-two.vercel.app/.

The deployed Vite app uses the MSW mock backend by default, so `/api/*` calls
work on static hosts like Vercel. Set `VITE_ENABLE_MOCKS=false` when deploying
with a real backend that serves those API routes.
