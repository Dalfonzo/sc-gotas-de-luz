import * as bcrypt from 'bcrypt'
import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { verifyJwt } from '~/lib/jtw'

const tokenVerificationHandler = async (token: string, secret: string) => {
  const resp = await verifyJwt(token, secret)
  if (resp.status === 'error' && resp.code === 'JWS_VERIFICATION_FAILED') {
    return { status: 'error', message: 'Token inválido o vencido.' }
  } else if (resp.status === 'error' && resp.code === 'UNKNOWN') {
    return { status: 'error', message: 'Ocurrió un error inesperado: ' + resp.payload }
  } else {
    return { status: 'success', message: 'ok' }
  }
}

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

    return await tokenVerificationHandler(token as string, secret)
  }

  const post = async () => {
    const { password } = req.body
    const { id, token } = req.query

    const user = await prisma.users.findUnique({
      where: { id: id as string },
    })

    if (!user) {
      // FIXME: Improve error handling
      throw new Error('invalid user')
    }

    const secret = process.env.SECRET_KEY + user.password
    const response = await tokenVerificationHandler(token as string, secret)

    if (response.status === 'error') {
      return response
    }

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
