import * as bcrypt from 'bcrypt'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

interface UserDto {
  name: string
  lastName: string
  email: string
  password: string
  fkRole: string
}

export default apiRouteAccessGuard(async (req, res) => {
  const get = async () =>
    await prisma.users.findMany({
      select: {
        name: true,
        lastName: true,
        email: true,
        fkRole: true,
        id: true,
      },
    })

  const post = async () => {
    const body: UserDto = req.body
    const role = await prisma.roles.findUnique({ where: { id: body.fkRole } })

    if (!role) {
      throw new Error(`Invalid RoleId`)
    }

    const user = await prisma.users.create({
      data: {
        name: body.name,
        lastName: body.lastName,
        password: await bcrypt.hash(body.password, 10),
        email: body.email,
        roles: { connect: { id: body.fkRole } },
      },
    })

    const { password, ...userWithoutPassword } = user as UserDto
    return userWithoutPassword
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.USERS)
