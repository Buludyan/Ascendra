import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, expect, it } from 'vitest'

import App from './App'

describe('App', () => {
  it('renders the workspace shell', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    )

    expect(screen.getByText(/ascendra workspaces/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /developer/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /admin/i })).toBeTruthy()
  })
})
