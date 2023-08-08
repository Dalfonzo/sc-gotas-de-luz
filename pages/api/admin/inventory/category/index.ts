import { Category, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.category
  const get = async () =>
    await paginationHandler<Category[], Prisma.CategoryFindManyArgs>(req, res, model, {
      orderBy: { name: 'asc' },
    })
  const post = async () => {
    return await model.create({ data: { ...req.body } })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.INVENTORY)
