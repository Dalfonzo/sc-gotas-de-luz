import { Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { INVENTORY_RECORD_TYPES, RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.inventoryRecord
  const get = async () => {
    const { expiring } = req.query
    const toExpireDate = add(new Date(), { months: Number(expiring) || 1 })
    const filters: Prisma.InventoryRecordFindManyArgs = {
      where: {
        currentQuantity: { gt: 0 },
        type: INVENTORY_RECORD_TYPES.INPUT,
        expirationDate: { lte: toExpireDate },
      },
    }

    const count = await model.count({ where: { ...filters.where } })
    return { pending: count }
  }

  await methodRouter(req, res, { get })
}, RESOURCES.INVENTORY)
