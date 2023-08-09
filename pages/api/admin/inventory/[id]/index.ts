// TODO: add api ROUTE
import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.inventory
  const id = String(req.query.id)
  const inventoryItem = await model.findFirstOrThrow({ where: { id: id } })
  // TODO: get with inventory records maybe
  const get = async () => inventoryItem

  const put = async () => {
    const body = req.body || {}
    const parsed = {
      ...(body.name && { name: body.name }),
      ...(body.measure && { measure: body.measure }),
      ...(body.categoryId && { categoryId: body.categoryId }),
      updatedAt: new Date().toISOString(),
    }
    return await model.update({
      data: parsed,
      where: { id },
    })
  }
  const remove = async () => {
    const data = await model.delete({ where: { id, name: req.body.confirm } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.VOLUNTEERS)
