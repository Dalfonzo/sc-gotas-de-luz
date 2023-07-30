import { JWTPayload } from 'jose'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/lib/db/prisma'
import { verifyJwt } from '~/lib/jtw'
import { User } from '~/ts/User'
import { HTTP_METHODS } from '../constants'

export const apiRouteAccessGuard =
  (handler: (_req: NextApiRequest, _res: NextApiResponse) => void, resourceName: string) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    const token = req.headers.authorization || ''
    const decodedToken = (await verifyJwt(token)) as User & JWTPayload

    const rows = await prisma.roles.findUnique({
      where: { id: decodedToken.fkRole },
      include: {
        permissions: {
          where: {
            resources: { name: resourceName.toUpperCase() },
            ...(method === HTTP_METHODS.POST && { create: true }),
            ...((method === HTTP_METHODS.PUT || method === HTTP_METHODS.PATCH) && { update: true }),
            ...(method === HTTP_METHODS.GET && { read: true }),
            ...(method === HTTP_METHODS.DELETE && { delete: true }),
          },
        },
      },
    })

    const operationAllowed = !!rows?.permissions.length
    if (!operationAllowed || !Object.keys(HTTP_METHODS).includes(method!)) {
      return res.status(403).json({ message: 'You do not have permission to do that operation on this resource.' })
    }

    return handler(req, res)
  }
