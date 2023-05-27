// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { endOfMonth, startOfMonth } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'
import { basicHandler } from '~/lib/api/handler'
import prisma from '~/lib/db/prisma'
import { EventI } from '~/lib/models/event'

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventI[]>) {
  const callback = async () => {
    let { start, end } = req.query

    const now = new Date()
    const startDate = typeof start == 'string' ? new Date(start) : startOfMonth(now)
    const endDate = typeof end == 'string' ? new Date(end) : endOfMonth(now)

    const events = await prisma.event.findMany({
      where: { AND: { start: { gte: startDate }, end: { lte: endDate } } },
    })
    return events
  }
  await basicHandler(callback, req, res)
}
