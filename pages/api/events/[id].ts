import { NextApiRequest, NextApiResponse } from 'next'
import { FILE_UPLOAD_FIELDS } from '~/lib/api/constants'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'

// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.event
  const id = Number(req.query.id)
  const get = async () => await model.findFirstOrThrow({ where: { id: id } })
  const put = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: false })
    const newsFile = files[FILE_UPLOAD_FIELDS.EVENTS]
    return await model.update({
      data: { ...req.body, ...(newsFile && { img: { update: newsFile } }) },
      where: { id },
    })
  }
  const remove = async () => {
    const data = await model.delete({ where: { id }, include: { img: true } })
    await prisma.fileDb.delete({ where: { id: data.img.id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}
