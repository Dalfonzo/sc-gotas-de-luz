import * as bcrypt from 'bcrypt'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/lib/db/prisma'
import { signJwtAccessToken } from '~/lib/jtw'
import { Permissions } from '~/ts/Permissions'
import { parsePermissions } from '~/utils/parsePermissions'

interface RequestBody {
  email: string
  password: string
}

export default async function handler(request: NextApiRequest, res: NextApiResponse<any>) {
  const body: RequestBody = await request.body

  const user = await prisma.users.findFirst({
    where: {
      email: body.email,
    },
    include: { roles: { include: { permissions: { include: { resources: true } } } } },
  })

  if (user && (await bcrypt.compare(body.password, user.password))) {
    const { password, ...userWithoutPass } = user
    const accessToken = await signJwtAccessToken(userWithoutPass)
    const result = {
      ...userWithoutPass,
      accessToken,
      permissions: parsePermissions(user.roles.permissions as Permissions[]),
    }
    return res.status(200).json(result)
  }

  return res.status(404).json({ message: 'user or password invalid' })
}
