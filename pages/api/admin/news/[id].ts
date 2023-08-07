import { NextApiRequest, NextApiResponse } from 'next'
import { beforeFileUpdate } from '~/lib/api/files/before-file-update'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

export const getNewsId = async (id: number) =>
  await prisma.news.findFirstOrThrow({ where: { id: id }, include: { img: true } })

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const id = Number(req.query.id)
  const newsItem = await getNewsId(id)
  const get = async () => newsItem
  const put = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: false })
    const newsFile = files
    if (newsFile) {
      await beforeFileUpdate(newsItem.imgId)
    }
    return await prisma.news.update({
      data: { ...req.body, ...(newsFile && { img: { update: newsFile } }) },
      where: { id },
    })
  }
  const remove = async () => {
    await beforeFileUpdate(newsItem.imgId)
    const data = await prisma.news.delete({ where: { id }, include: { img: true } })

    await prisma.fileDb.delete({ where: { id: data?.img.id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.NEWS)
