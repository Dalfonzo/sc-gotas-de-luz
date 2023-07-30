import { Prisma } from '@prisma/client'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { Roles } from '~/ts/Roles'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

interface bodyPostDto {
  name: string
  permissions: [
    {
      create: boolean
      delete: boolean
      update: boolean
      read: boolean
      resourceId: string
      roleId: string
    }
  ]
}

export default apiRouteAccessGuard(async (req, res) => {
  const get = async () =>
    await paginationHandler<Roles[], Prisma.RolesFindManyArgs>(req, res, prisma.roles, {
      orderBy: { name: 'desc' },
      include: { permissions: true },
    })

  const post = async () => {
    const body: bodyPostDto = req.body

    return await prisma.$transaction(async (tx) => {
      const role = await tx.roles.create({
        data: { name: body.name },
      })

      if (!role.id) {
        throw new Error(`Role couldn't be created`)
      }

      const permissions = await tx.permissions.createMany({
        data: body.permissions.map((permission) => ({ ...permission, roleId: role.id })),
      })

      if (!permissions) {
        throw new Error(`Permissions associated to the role couldn't be created`)
      }

      return role
    })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.ROLES)
