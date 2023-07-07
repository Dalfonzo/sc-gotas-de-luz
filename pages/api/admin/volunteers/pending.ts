import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.volunteer
  const get = async () => {
    const count = await model.count({ where: { isActive: false } })
    return {
      pending: count,
    }
  }
  await methodRouter(req, res, { get })
}
