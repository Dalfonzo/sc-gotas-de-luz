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

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.event
  const id = Number(req.query.id)
  const eventItem = await model.findFirstOrThrow({ where: { id: id }, include: { img: true } })
  const get = async () => eventItem
  const put = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: false })
    const eventFile = files
    if (eventFile) {
      await beforeFileUpdate(eventItem.imgId)
    }
    return await model.update({
      data: { ...req.body, ...(eventFile && { img: { update: eventFile } }) },
      where: { id },
    })
  }
  const remove = async () => {
    await beforeFileUpdate(eventItem?.imgId)
    const data = await model.delete({ where: { id }, include: { img: true } })

    await prisma.fileDb.delete({ where: { id: data?.img.id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.EVENTS)
