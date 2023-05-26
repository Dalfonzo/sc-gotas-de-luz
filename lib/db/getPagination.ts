import { NextApiRequest } from 'next'
export interface PaginationI {
  skip: number
  take?: number
}
// TODO: check if using next default middleware (https://nextjs.org/docs/pages/building-your-application/routing/middleware) is enough or using https://github.com/KolbySisk/next-api-route-middleware
export function getPagination(req: NextApiRequest): PaginationI {
  const { page, size } = req.query
  const parsedPage = typeof page === 'string' ? parseInt(page) : 0
  const parsedSize = typeof size === 'string' ? parseInt(size) : 0
  return {
    skip: parsedPage * parsedSize,
    ...(parsedSize > 0 && { take: parsedSize }),
  }
}
