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
  const get = async () => {
    const userId = req.query.id as string

    if (!userId) {
      throw new Error(`UserId is required`)
    }

    return await prisma.users.findUnique({
      select: {
        name: true,
        lastName: true,
        email: true,
        fkRole: true,
        id: true,
      },
      where: { id: userId },
    })
  }

  const put = async () => {
    const userId = req.query.id as string
    const body: Partial<UserDto> = req.body

    if (!userId) {
      throw new Error(`UserId is required`)
    }

    const user = await prisma.users.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error(`User does not exist`)
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data: {
        ...user,
        ...(body.password && { password: await bcrypt.hash(body.password, 10) }),
        ...(body.name && { name: body.name }),
        ...(body.lastName && { lastName: body.lastName }),
        ...(body.email && { email: body.email }),
        ...(body.fkRole && { fkRole: body.fkRole }),
      },
    })
    const { password, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }

  const del = async () => {
    const userId = req.query.id as string

    if (!userId) {
      throw new Error(`UserId is required`)
    }

    const deletedUser = await prisma.users.delete({ where: { id: userId } })

    return { id: deletedUser?.id }
  }

  await methodRouter(req, res, { get, delete: del, put })
}, RESOURCES.USERS)
