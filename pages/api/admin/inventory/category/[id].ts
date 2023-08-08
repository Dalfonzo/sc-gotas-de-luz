import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.category
  const id = Number(req.query.id)
  const categoryItem = await model.findFirstOrThrow({ where: { id: id } })
  const get = async () => categoryItem

  const put = async () => {
    return await model.update({
      data: { ...req.body },
      where: { id },
    })
  }

  const remove = async () => {
    const inventoryUse = await prisma.inventory.findFirst({ where: { categoryId: id } })
    if (inventoryUse) {
      throw new BadRequestError(`This category is being used by an inventory item`)
    }
    const data = await model.delete({ where: { id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.VOLUNTEERS)
