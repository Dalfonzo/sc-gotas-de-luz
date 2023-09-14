import { Prisma } from '@prisma/client'
import { BadRequestError, ConflictError } from '~/lib/api/errors/api-error'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { signJwtAccessToken } from '~/lib/jtw'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'
import { User } from '~/ts/User'
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
    await paginationHandler<User[], Prisma.UsersFindManyArgs>(req, res, prisma.users, {
      select: {
        name: true,
        lastName: true,
        email: true,
        fkRole: true,
        id: true,
        roles: true,
        canBeDeleted: true,
      },
    })

  const post = async () => {
    const body: UserDto = req.body
    const role = await prisma.roles.findUnique({ where: { id: body.fkRole } })

    if (!role) {
      throw new BadRequestError(`Invalid roleId`)
    }

    const userByEmail = await prisma.users.findUnique({ where: { email: body.email } })
    const emailAlreadyExists = !!userByEmail

    if (emailAlreadyExists) {
      throw new ConflictError(`Email already registered`)
    }

    const user = await prisma.users.create({
      data: {
        name: body.name,
        lastName: body.lastName,
        email: body.email,
        roles: { connect: { id: body.fkRole } },
      },
    })

    const { password, ...userWithoutPassword } = user as UserDto

    const payload = { email: user.email, id: user.id }
    const secret = process.env.SECRET_KEY + user.password
    const token = await signJwtAccessToken(payload, secret, process.env.EMAIL_TOKEN_EXPIRATION_TIME)
    const link = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${user.id}/${token}?firstTime=true`

    await mailer.sendEmail({
      to: user.email,
      ...MAIL_TEMPLATES.ACCOUNT_CREATED,
      data: {
        button: 'Registrar contraseña',
        name: user.name,
        title: '¡Bienvenido!',
        url: link,
      },
    })

    return userWithoutPassword
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.USERS)
