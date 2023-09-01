import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import { getDonationMethods } from '../admin/donation/method'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const get = async () => await getDonationMethods(req, res)

  await methodRouter(req, res, { get })
}
