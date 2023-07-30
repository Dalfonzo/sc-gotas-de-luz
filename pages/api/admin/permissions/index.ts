import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req, res) => {
  const get = async () =>
    await prisma.permissions.findMany({
      include: {
        resources: true,
        roles: true,
      },
    })
  const post = async () =>
    await prisma.permissions.createMany({
      data: req.body,
    })

  await methodRouter(req, res, { get, post })
}, RESOURCES.ROLES)
