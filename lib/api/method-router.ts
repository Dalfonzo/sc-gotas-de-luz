import { NextApiRequest, NextApiResponse } from 'next'

export type API_METHODS = 'get' | 'post' | 'put' | 'delete'

type Dto = {
  [x in API_METHODS]?: () => Promise<void>
}

export async function methodRouter(req: NextApiRequest, res: NextApiResponse, methods: Dto) {
  const method = (req.method?.toLowerCase() || 'get') as API_METHODS
  const call = methods[method]
  if (call) {
    try {
      return await call()
    } catch (error) {
      res.status(500).end()
      return
    }
  }
  res.status(405).end()
}
