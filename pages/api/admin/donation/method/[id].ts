import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.donationMethod
  const id = Number(req.query.id)
  const methodItem = await model.findFirstOrThrow({ where: { id: id } })
  const get = async () => methodItem

  const put = async () => {
    return await model.update({
      data: { ...req.body },
      where: { id },
    })
  }

  const remove = async () => {
    const donationUse = await prisma.donation.findFirst({ where: { methodId: id } })
    if (donationUse) {
      throw new BadRequestError(`This method is being used by a donation`)
    }
    const data = await model.delete({ where: { id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.DONATIONS)
