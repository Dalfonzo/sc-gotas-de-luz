import { Donation, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

const model = prisma.donation
export const getDonations = async (req: NextApiRequest, res: NextApiResponse, publicView = false) => {
  const { isVerified } = req.query
  return await paginationHandler<Donation[], Prisma.DonationFindManyArgs>(req, res, model, {
    orderBy: { date: 'desc' },
    ...(publicView && {
      select: { reference: false, imgId: false, amount: true, isAnon: true, name: true, message: true, date: true },
      where: {
        isVerified: true,
      },
    }),
    ...(publicView === false && {
      include: { img: true, method: true },
      where: {
        ...(isVerified && { isVerified: String(isVerified) === 'true' }),
      },
    }),
  })
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const get = async () => getDonations(req, res)

  await methodRouter(req, res, { get })
}, RESOURCES.DONATIONS)
