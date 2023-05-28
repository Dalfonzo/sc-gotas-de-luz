import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  const get = async () => await prisma.news.findFirstOrThrow({ where: { id: id } })
  const put = async () => {
    return await prisma.news.update({ data: { ...req.body }, where: { id } })
  }
  const remove = async () => {
    return await prisma.news.delete({ where: { id } })
  }
  await methodRouter(req, res, { get, put, delete: remove })
}
