import type { NextApiRequest, NextApiResponse } from 'next'
import { paginator } from './paginator'

export async function basicHandler<Response>(
  callback: () => Response | Promise<Response>,
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const result = await callback()
    res.send(result)
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}

export async function paginationHandler<T, Args>(req: NextApiRequest, res: NextApiResponse, model: any, args?: Args) {
  try {
    const paginate = paginator()
    const result = await paginate<T, Args>(model, req, args)
    res.setHeader('total-count', result.meta.total)
    res.setHeader('last-page', result.meta.lastPage)
    res.send(result.data)
  } catch (error) {
    console.error(error)
    res.status(500).end()
  }
}
