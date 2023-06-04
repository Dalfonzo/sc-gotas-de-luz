import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

interface PutDto {
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
  const del = async () => {
    const roleId = req.query.id as string

    if (!roleId) {
      throw new Error(`Role id can't be blank`)
    }

    return await prisma.roles.delete({
      where: { id: roleId },
      include: { permissions: true },
    })
  }

  const put = async () => {
    const body: PutDto = req.body
    const roleId = req.query.id as string

    if (!roleId) {
      throw new Error(`Role id can't be blank`)
    }

    return await prisma.$transaction(async (tx) => {
      const role = await tx.roles.update({
        data: { name: body.name },
        where: { id: roleId },
      })

      await tx.permissions.deleteMany({
        where: { roleId },
      })

      await tx.permissions.createMany({
        data: body.permissions.map((permission) => ({ ...permission, roleId: role.id })),
      })

      return role
    })
  }

  const get = async () => {
    const roleId = req.query.id as string

    if (!roleId) {
      throw new Error(`Role id is required`)
    }
    return await prisma.roles.findUnique({
      where: { id: roleId },
      include: { permissions: true },
    })
  }

  await methodRouter(req, res, { delete: del, put, get })
}, RESOURCES.ROLES)
