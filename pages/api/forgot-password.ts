import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { signJwtAccessToken } from '~/lib/jtw'

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
    // FIXME: DUPLICATED
    const secret = process.env.SECRET_KEY + user.password
    const token = await signJwtAccessToken(payload, secret, '7d')
    const link = `http://localhost:3000/reset-password/${user.id}/${token}`
    // FIXME: send this to email
    console.log(link)
    // TODO: Remove this
    return { link }
  }

  await methodRouter(req, res, { post })
}
