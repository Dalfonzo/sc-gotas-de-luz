import { NextApiRequest, NextApiResponse } from 'next'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { getDonations } from '../admin/donation'
// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.donation
  const get = async () => await getDonations(req, res, true)

  const post = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: true })
    const body = req.body
    const isAnon = body.isAnon === 'true' || body.isAnon === true
    const methodId = Number(delete body.methodId)
    return await model.create({
      data: {
        ...body,
        ...(isAnon && { name: null }),
        isVerified: false,
        isAnon: isAnon,
        amount: Number(body.amount),
        img: { create: { ...files } },
        method: { connect: { id: methodId } },
      },
    })
  }

  await methodRouter(req, res, { get, post })
}
