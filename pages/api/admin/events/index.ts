import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { EventI } from '~/lib/models/event'
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
  const get = async () =>
    await paginationHandler<EventI[], Prisma.EventFindManyArgs>(req, res, model, {
      orderBy: { start: 'desc' },
      include: { img: true },
    })
  const post = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: true })
    const event: Prisma.EventCreateInput = req.body
    if (event.start > event.end) {
      throw new BadRequestError('Start date should preceed end date')
    }
    return await model.create({ data: { ...event, img: { create: { ...files } } } })
  }
  await methodRouter(req, res, { get, post })
}, RESOURCES.EVENTS)
