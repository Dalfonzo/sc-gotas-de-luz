import { DonationMethod, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

const model = prisma.donationMethod
export const getDonationMethods = async (req: NextApiRequest, res: NextApiResponse) =>
  await paginationHandler<DonationMethod[], Prisma.DonationMethodFindManyArgs>(req, res, model, {
    orderBy: { name: 'asc' },
  })

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const get = async () => getDonationMethods(req, res)

  const post = async () => {
    return await model.create({ data: { ...req.body } })
  }

  await methodRouter(req, res, { get, post })
}, RESOURCES.DONATIONS)
