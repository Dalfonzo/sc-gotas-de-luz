import { add } from 'date-fns'
import { NextApiRequest, NextApiResponse } from 'next'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { getGoogleInstance } from '~/lib/google/google-apis'

interface FormBody {
  respondentEmail: string
  name: string
  phone: string
  responseId: string
  personId: string
  birthDate: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const post = async () => {
    const googleInstance = getGoogleInstance()
    const body: FormBody = req.body
    const formId = process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEERS_ID
    const timestamp = add(new Date(), { minutes: -5 })
    const entries = await googleInstance.responses.list({
      formId,
      pageSize: 100,
      filter: `timestamp >= ${timestamp.toISOString()}`,
    })
    const entry = entries.data.responses?.find((ent) => ent.respondentEmail === body.respondentEmail)

    if (!entry) {
      throw new BadRequestError(`Response <${body.respondentEmail}> doesn't exist`)
    }

    if (!entry.responseId) {
      throw new Error(`Response id couln't be retrieved`)
    }

    await prisma.volunteer.create({
      data: {
        name: body.name,
        birthDate: body.birthDate,
        email: body.respondentEmail,
        phone: body.phone,
        formReference: entry.responseId,
      },
    })
    res.status(200).end()
  }

  await methodRouter(req, res, { post })
}
