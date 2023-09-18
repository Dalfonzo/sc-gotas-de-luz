import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.donationSubscriber
  const id = String(req.query.id)
  const subscriberItem = await model.findFirstOrThrow({ where: { id: id } })
  const get = async () => subscriberItem

  const put = async () => {
    return await model.update({
      data: { ...req.body },
      where: { id },
    })
  }

  const remove = async () => {
    const data = await model.delete({ where: { id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.DONATIONS)
