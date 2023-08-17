import { InventoryRecord, Prisma } from '@prisma/client'
import { add } from 'date-fns'
import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { INVENTORY_RECORD_TYPES, RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

interface CreateDto extends Prisma.InventoryRecordCreateInput {
  outputs?: { id: string; quantity: number }[]
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.inventoryRecord
  const inventoryID = String(req.query.id)
  const get = async () => {
    const { filter, expiring, remaining } = req.query
    const toExpireDate = add(new Date(), { months: Number(expiring) || 1 })
    const filters: Prisma.InventoryRecordFindManyArgs = {
      where: {
        ...((filter && {
          type: filter.includes('output') ? INVENTORY_RECORD_TYPES.OUTPUT : INVENTORY_RECORD_TYPES.INPUT,
        }) ||
          (expiring && {
            currentQuantity: { gt: 0 },
            type: INVENTORY_RECORD_TYPES.INPUT,
            expirationDate: { lte: toExpireDate },
          }) ||
          {}),
        ...(remaining && {
          type: INVENTORY_RECORD_TYPES.INPUT,
          currentQuantity: {
            gte: Number(remaining),
          },
        }),
      },
    }

    return await paginationHandler<InventoryRecord[], Prisma.InventoryRecordFindManyArgs>(req, res, model, {
      orderBy: { date: 'desc' },
      where: {
        inventoryId: inventoryID,
        ...filters.where,
      },
    })
  }

  const post = async () => {
    const body: CreateDto = req.body
    const inventory = await prisma.inventory.findFirstOrThrow({ where: { id: inventoryID } })
    let quantity = body.quantity || body.outputs?.reduce<number>((a, b) => a + b.quantity, 0)
    let outputs: (InventoryRecord & { extract: number })[] = []
    if (body.outputs) {
      outputs = await Promise.all(
        body.outputs?.map(async (output) => {
          return {
            extract: output.quantity,
            ...(await model.findFirstOrThrow({ where: { id: output.id, quantity: { gte: output.quantity } } })),
          }
        })
      )
      if (quantity && quantity > 0) {
        quantity = quantity * -1
      }
    }
    if (!quantity || inventory.currentQuantity + quantity < 0) {
      throw new BadRequestError(`Inventory quantity can't go below zero`)
    }

    delete body.outputs
    const [created] = await prisma.$transaction([
      model.create({
        data: {
          ...req.body,
          quantity: quantity,
          inventoryId: inventoryID,
          currentQuantity: quantity,
          type: body.quantity > 0 ? INVENTORY_RECORD_TYPES.INPUT : INVENTORY_RECORD_TYPES.OUTPUT,
        },
      }),
      ...outputs.map((output) =>
        model.update({ data: { currentQuantity: output.currentQuantity - output.extract }, where: { id: output.id } })
      ),
      prisma.inventory.update({
        where: { id: inventoryID },
        data: { currentQuantity: inventory.currentQuantity + quantity },
      }),
    ])
    return created
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.INVENTORY)
