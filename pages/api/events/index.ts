import { Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { FILE_UPLOAD_FIELDS } from '~/lib/api/constants'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { EventI } from '~/lib/models/event'

// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.event
  const get = async () =>
    await paginationHandler<EventI[], Prisma.EventFindManyArgs>(req, res, model, {
      orderBy: { start: 'desc' },
      include: { img: true },
    })
  const post = async () => {
    const files = await fileUploadHandler(req)
    const event: Prisma.EventCreateInput = req.body
    if (event.start > event.end) {
      throw new BadRequestError('Start date should preceed end date')
    }
    return await model.create({ data: { ...event, img: { create: { ...files[FILE_UPLOAD_FIELDS.EVENTS] } } } })
  }
  await methodRouter(req, res, { get, post })
}
