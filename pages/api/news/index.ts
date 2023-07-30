import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { NewsI } from '~/lib/models/news'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const get = async () =>
    await paginationHandler<NewsI[], Prisma.NewsFindFirstArgs>(req, res, prisma.news, {
      orderBy: { date: 'desc' },
      include: { img: true },
    })

  await methodRouter(req, res, { get })
}
