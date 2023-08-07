import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { verifyJwt } from '~/lib/jtw'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const get = async () => {
    const { id, token } = req.query

    if (!id || !token) {
      throw new Error('id and token required')
    }

    const user = await prisma.users.findUnique({
      where: { id: id as string },
    })

    if (!user) {
      // FIXME: Improve error handling
      throw new Error('invalid user')
    }

    const secret = process.env.SECRET_KEY + user.password
    // crear secret con el JWT y el password
    // crear payload con email y userid

    await verifyJwt(token as string, secret)
    // FIXME: Improve this
    return { message: 'ok' }
    // Si todo sale bien, muestro la pantalla para escribir el password y su confirmacion
  }

  const post = async () => {
    const { password } = req.body
    const { id, token } = req.query

    //  Revisar si usuario email existe en db

    const user = await prisma.users.findUnique({
      where: { id: id as string },
    })

    if (!user) {
      // FIXME: Improve error handling
      throw new Error('invalid user')
    }

    // Validamos token
    const secret = process.env.SECRET_KEY + user.password
    await verifyJwt(token as string, secret)

    // update user con new password
    // FIXME: Remove this duplicated code
    const updatedUser = await prisma.users.update({
      where: { id: id as string },
      data: {
        ...user,
        ...(password && { password: await bcrypt.hash(password, 10) }),
      },
    })

    const { password: _, ...userWithoutPassword } = updatedUser

    return userWithoutPassword
  }

  await methodRouter(req, res, { get, post })
}
