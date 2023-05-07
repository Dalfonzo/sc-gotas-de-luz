import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/lib/db/prisma'
import { NewsI } from '~/lib/models/news'

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsI[]>) {
  return await prisma.news.findMany()
}
