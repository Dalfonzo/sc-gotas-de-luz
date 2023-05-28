import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-handler'
import prisma from '~/lib/db/prisma'
import { NewsI } from '~/lib/models/news'

export default async function handler(req: NextApiRequest, res: NextApiResponse<NewsI[]>) {
  const get = async () =>
    await paginationHandler<NewsI[], Prisma.NewsFindManyArgs>(req, res, prisma.news, { orderBy: { date: 'desc' } })
  await methodRouter(req, res, { get })
}
