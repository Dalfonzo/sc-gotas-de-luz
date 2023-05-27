import { NextApiRequest, NextApiResponse } from 'next'
import { basicHandler } from '~/lib/api/handler'
import prisma from '~/lib/db/prisma'
import { NewsI } from '~/lib/models/news'

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsI[]>) {
  const callback = async () => {
    return await prisma.news.findMany({ orderBy: { date: 'desc' } })
  }
  await basicHandler(callback, req, res)
}
