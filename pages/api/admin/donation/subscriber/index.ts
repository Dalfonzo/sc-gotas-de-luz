import { DonationSubscriber, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.donationSubscriber
  const get = async () =>
    await paginationHandler<DonationSubscriber[], Prisma.DonationSubscriberFindManyArgs>(req, res, model, {
      orderBy: { email: 'asc' },
    })

  const post = async () => {
    return await model.create({ data: { ...req.body } })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.DONATIONS)
