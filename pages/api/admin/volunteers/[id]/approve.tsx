import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'

import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { mailer } from '~/lib/mailer/mailer'
import { MAIL_TEMPLATES } from '~/lib/mailer/templates'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

const model = prisma.volunteer

export const approveVolunteer = async (id: string) => {
  const volunteer = await model.findFirst({ where: { id } })
  if (!volunteer) {
    throw new BadRequestError(`Volunteer [${id}] not found`)
  }
  return await prisma.$transaction(async (tx) => {
    const updated = await tx.volunteer.update({ data: { isActive: true }, where: { id: id } })
    await mailer.sendEmail({
      to: volunteer.email,
      ...MAIL_TEMPLATES.VOLUNTEER_APPROVED,
      // TODO: determine email action
      data: { name: volunteer.name, title: `Voluntariado Aceptado`, button: 'TBD', url: '' },
    })
    return updated
  })
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const id = String(req.query.id)

  const put = async () => {
    return await approveVolunteer(id)
  }

  await methodRouter(req, res, { put })
}, RESOURCES.EVENTS)
