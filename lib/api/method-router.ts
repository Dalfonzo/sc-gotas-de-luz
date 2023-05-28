import { NextApiRequest, NextApiResponse } from 'next'
import { errorHandler } from './errors/error-handler'

export type API_METHODS = 'get' | 'post' | 'put' | 'delete'

type Dto = {
  // call that don't return undefined will be sent as response
  [x in API_METHODS]?: () => Promise<void | any>
}

export async function methodRouter(req: NextApiRequest, res: NextApiResponse, methods: Dto) {
  const method = (req.method?.toLowerCase() || 'get') as API_METHODS
  const call = methods[method]
  if (call) {
    await errorHandler(async () => {
      const result = await call()
      if (result !== undefined) {
        res.send(result)
      }
    }, res)
    return
  }
  res.status(405).end()
}
