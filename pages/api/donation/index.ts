import { NextApiRequest, NextApiResponse } from 'next'
import { fileUploadHandler } from '~/lib/api/files/file-handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'
import { getDonations } from '../admin/donation'
// Important for NextJS file uploads!
export const config = {
  api: {
    bodyParser: false,
  },
}

const alertDonation = async () => {
  const subscribers = await prisma.donationSubscriber.findMany({ take: 50 })
  if (!subscribers.length) {
    return
  }
  mailer.sendEmail({
    to: subscribers.map((s) => s.email),
    subject: MAIL_TEMPLATES.DONATION_RECEIVED.subject(),
    data: { appendUrl: 'admin?goto=donations', title: 'Alerta de Donativo' },
    templatePath: MAIL_TEMPLATES.DONATION_RECEIVED.templatePath,
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const model = prisma.donation
  const get = async () => await getDonations(req, res, true)

  const post = async () => {
    const files = await fileUploadHandler(req, { throwOnEmpty: false })
    const body = req.body
    const isAnon = body.isAnon === 'true' || body.isAnon === true
    const methodId = Number(delete body.methodId)

    const created = await model.create({
      data: {
        ...body,
        ...(isAnon && { name: null }),
        isVerified: false,
        isAnon: isAnon,
        amount: Number(body.amount),
        ...(files && { img: { create: { ...files } } }),
        method: { connect: { id: methodId } },
      },
    })
    try {
      await alertDonation()
    } catch (error) {
      console.log(`Error at donation email alert`, error)
    }
    return created
  }

  await methodRouter(req, res, { get, post })
}
