import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req, res) => {
  const get = async () => await prisma.resources.findMany()
  await methodRouter(req, res, { get })
}, RESOURCES.ROLES)
