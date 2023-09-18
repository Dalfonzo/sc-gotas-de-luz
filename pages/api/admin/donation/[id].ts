import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

const DEFAULT_THANKS =
  'Gracias a esta colaboración, podremos alcanzar a más personas y dar más gotas de luz a nuestra comunidad. ¡Muchísimas gracias!'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.donation
  const id = String(req.query.id)
  const methodItem = await model.findFirstOrThrow({ where: { id: id } })
  const get = async () => methodItem

  const put = async () => {
    const body = req.body
    return await prisma.$transaction(async (tx) => {
      const updated = await tx.donation.update({
        data: { isVerified: req.body.isVerified, ...(body.amount && { amount: body.amount }) },
        where: { id },
      })
      if (updated.email && updated.isVerified && !updated.emailSent) {
        await tx.donation.update({ data: { emailSent: true }, where: { id: id } })
        await mailer.sendEmail({
          to: updated.email,
          ...MAIL_TEMPLATES.DONATION_APPROVED,
          data: {
            name: updated.name || 'donador anónimo',
            title: `Donativo Verificado`,
            data: { message: body.thanks || DEFAULT_THANKS },
            appendUrl: 'donate',
          },
        })
      }
      return updated
    })
  }

  const remove = async () => {
    const donationUse = await prisma.donation.findFirst({ where: { id: id } })
    if (donationUse?.isVerified) {
      throw new BadRequestError(`Cannot delete verified donation`)
    }
    const data = await model.delete({ where: { id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.DONATIONS)
