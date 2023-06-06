import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import { getNewsId } from '../admin/news/[id]'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id)
  const get = async () => await getNewsId(id)
  await methodRouter(req, res, { get })
}
