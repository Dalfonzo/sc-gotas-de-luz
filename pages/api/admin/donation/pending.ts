import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { PendingResult } from '~/prisma/types'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

const model = prisma.donation

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const get = async (): Promise<PendingResult> => {
    const result = await model.count({ where: { isVerified: false } })
    return {
      pending: result,
    }
  }

  await methodRouter(req, res, { get })
}, RESOURCES.DONATIONS)
