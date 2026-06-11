import { create } from 'zustand'

export type WorkspacePersona = 'developer' | 'admin'

interface WorkspaceState {
  persona: WorkspacePersona
  setPersona: (persona: WorkspacePersona) => void
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  persona: 'developer',
  setPersona: (persona) => set({ persona }),
}))
