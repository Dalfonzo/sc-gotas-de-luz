import { InventoryRecord, Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
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
    return await paginationHandler<InventoryRecord[], Prisma.InventoryRecordFindManyArgs>(req, res, model, {
      orderBy: { expirationDate: 'asc' },
      where: {
        ...filters.where,
      },
      include: { inventory: true },
    })
  }

  await methodRouter(req, res, { get })
}, RESOURCES.INVENTORY)
