import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { FILE_UPLOAD_FIELDS } from '~/lib/api/constants'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { NewsI } from '~/lib/models/news'

// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  prisma.news.findMany()
  const get = async () =>
    await paginationHandler<NewsI[], Prisma.NewsFindFirstArgs>(req, res, prisma.news, {
      orderBy: { date: 'desc' },
      include: { img: true },
    })
  const post = async () => {
    const files = await fileUploadHandler(req)
    return await prisma.news.create({ data: { ...req.body, img: { create: { ...files[FILE_UPLOAD_FIELDS.NEWS] } } } })
  }
  await methodRouter(req, res, { get, post })
}
