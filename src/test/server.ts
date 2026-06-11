import { setupServer } from 'msw/node'

import { handlers } from '../api/mockHandlers'

export const server = setupServer(...handlers)
