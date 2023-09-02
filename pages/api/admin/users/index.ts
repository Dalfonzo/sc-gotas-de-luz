import * as bcrypt from 'bcrypt'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { signJwtAccessToken } from '~/lib/jtw'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'
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
        roles: true,
        canBeDeleted: true,
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
