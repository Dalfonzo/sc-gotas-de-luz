import * as bcrypt from 'bcrypt'
import prisma from '~/lib/db/prisma'
import { HTTP_METHODS } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

interface UserDto {
  name: string
  email: string
  password: string
  fkRole: string
}

export default apiRouteAccessGuard(async (request, res) => {
  const { body, method } = request

  if (method === HTTP_METHODS.POST) {
    const user = await prisma.users.create({
      data: {
        name: body.name,
        lastName: body.last_name,
        password: await bcrypt.hash(body.password, 10),
        email: body.email,
        roles: { connect: { id: '8ef28a6b-5ab9-4984-ae63-5ca408f32de0' } },
      },
    })
    const { password, ...userWithoutPassword } = user as UserDto
    return res.status(200).json(userWithoutPassword)
  }
}, 'news')
