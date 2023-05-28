import { Event, Prisma } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { EventI } from '~/lib/models/event'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.event
  const get = async () =>
    await paginationHandler<EventI[], Prisma.EventFindManyArgs>(req, res, model, { orderBy: { start: 'desc' } })
  const post = async () => {
    const event: Event = req.body
    if (event.start > event.end) {
      throw new BadRequestError('Start date should preceed end date')
    }
    return await model.create({ data: { ...req.body } })
  }
  await methodRouter(req, res, { get, post })
}
