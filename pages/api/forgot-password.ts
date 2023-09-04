import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { signJwtAccessToken } from '~/lib/jtw'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const post = async () => {
    const { email } = req.body

    const user = await prisma.users.findUnique({
      where: { email },
    })

    if (!user) {
      // FIXME: Improve error handling
      throw new Error('invalid user')
    }
    const payload = { email, id: user.id }

    const secret = process.env.SECRET_KEY + user.password
    const token = await signJwtAccessToken(payload, secret, process.env.EMAIL_TOKEN_EXPIRATION_TIME)
    const link = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password/${user.id}/${token}`

    await mailer.sendEmail({
      to: email,
      ...MAIL_TEMPLATES.FORGOT_PASSWORD,
      data: { button: 'Cambiar contraseña', title: 'Cambio de contraseña', url: link },
    })

    return { message: 'email send successfully' }
  }

  await methodRouter(req, res, { post })
}
