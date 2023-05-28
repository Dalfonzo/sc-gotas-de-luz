// Adapted from: https://nodeteam.medium.com/nest-js-prisma-pagination-b776592f1867

import { NextApiRequest } from 'next'

export interface PaginatedResult<T> {
  data: T[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export type PaginateOptions = { page?: number | string; perPage?: number | string }
export type PaginateFunction = <Result, Conditions>(
  model: any,
  req: NextApiRequest,
  args?: Conditions
) => Promise<PaginatedResult<Result>>

export const paginator = (defaultOptions?: PaginateOptions): PaginateFunction => {
  return async (model, req, args: any = { where: undefined }) => {
    const options: PaginateOptions = {
      page: req.query.page as string | undefined,
      perPage: req.query.size as string | undefined,
    }
    const page = Number(options?.page || defaultOptions?.page) || 1
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10
    const skip = page > 0 ? perPage * (page - 1) : 0
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ])
    const lastPage = Math.ceil(total / perPage)

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: page > 1 ? page - 1 : null,
        next: page < lastPage ? page + 1 : null,
      },
    }
  }
}
