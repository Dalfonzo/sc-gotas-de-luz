import type { NextApiRequest, NextApiResponse } from 'next'
import { errorHandler } from './errors/error-handler'
import { paginator } from './paginator'

export async function basicHandler<Response>(
  callback: () => Response | Promise<Response>,
  req: NextApiRequest,
  res: NextApiResponse
) {
  await errorHandler(async () => {
    const result = await callback()
    res.send(result)
  }, res)
}

export async function paginationHandler<T, Args>(req: NextApiRequest, res: NextApiResponse, model: any, args?: Args) {
  const callback = async () => {
    const paginate = paginator({ pageZero: true, page: 0 })
    const result = await paginate<T, Args>(model, req, args)
    res.setHeader('total-count', result.meta.total)
    res.setHeader('last-page', result.meta.lastPage)
    return result.data
  }
  await basicHandler<T[]>(callback, req, res)
}
