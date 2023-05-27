// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { endOfMonth, startOfMonth } from 'date-fns'
import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '~/lib/db/prisma'
import { EventI } from '~/lib/models/event'

export default async function handler(req: NextApiRequest, res: NextApiResponse<EventI[]>) {
  let { start, end } = req.query

  const now = new Date()
  const startDate = typeof start == 'string' ? new Date(start) : startOfMonth(now)
  const endDate = typeof end == 'string' ? new Date(end) : endOfMonth(now)

  try {
    const events = await prisma.event.findMany({
      where: { AND: { start: { gte: startDate }, end: { lte: endDate } } },
    })
    res.send(events)
  } catch (error) {
    console.error(error)

    res.status(500).end()
  }
}
