import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.inventoryRecord
  const inventoryId = String(req.query.id)
  const id = String(req.query.recordId)
  const inventoryItem = await model.findFirstOrThrow({ where: { id: id, inventoryId: inventoryId } })

  const get = async () => inventoryItem

  const put = async () => {
    const body = req.body || {}
    const parsed = {
      ...(body.concept && { concept: body.concept }),
      ...((body.expirationDate || body.expirationDate === null) && { expirationDate: body.expirationDate }),
      ...(body.date && { date: body.date }),
    }
    return await model.update({
      data: parsed,
      where: { id },
    })
  }

  await methodRouter(req, res, { get, put })
}, RESOURCES.VOLUNTEERS)
