import { delay, http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/health', async () => {
    await delay(120)

    return HttpResponse.json({
      status: 'ok',
    })
  }),
]
