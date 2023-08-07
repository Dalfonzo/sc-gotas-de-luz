import { Volunteer } from '@prisma/client'
import { forms_v1 } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'

import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { getGoogleInstance } from '~/lib/google/google-apis'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export interface VolunteerDetailResponse {
  form:
    | (Omit<forms_v1.Schema$FormResponse, 'answers'> & {
        answers:
          | (forms_v1.Schema$Answer & {
              title?: string | undefined | null
            })[]
          | null
          | undefined
      })
    | null
  values: Volunteer
}

export const getVolunteerDetails = async (id: string): Promise<VolunteerDetailResponse | null> => {
  const item = await prisma.volunteer.findFirst({ where: { id: id } })
  if (!item) {
    return null
  }
  const formId = process.env.NEXT_PUBLIC_GOOGLE_FORM_VOLUNTEERS_ID
  const googleInstance = getGoogleInstance()
  let formResponse: VolunteerDetailResponse['form'] = null
  if (item.formReference) {
    const form = await googleInstance.get({ formId: formId })
    const response = (
      await googleInstance.responses.get({
        formId: formId,
        responseId: item.formReference,
      })
    ).data
    const titleMap: Record<string, string | null | undefined> = {}

    form.data.items?.forEach((item) => {
      titleMap[item.questionItem?.question?.questionId || ''] = item.title
    })

    formResponse = {
      ...response,
      answers: response.answers
        ? Object.keys(response.answers).map((answer) => ({
            ...(response.answers && {
              ...response.answers[answer],
              title: titleMap[response.answers[answer].questionId || ''],
            }),
          }))
        : null,
    }
  }
  return {
    form: formResponse,
    values: item,
  }
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.volunteer
  const id = String(req.query.id)

  const get = async () => {
    return getVolunteerDetails(id)
  }
  const put = async () => {
    return await model.update({
      data: { ...req.body },
      where: { id },
    })
  }
  const remove = async () => {
    const data = await model.delete({ where: { id } })
    return data
  }
  await methodRouter(req, res, { get, put, delete: remove })
}, RESOURCES.VOLUNTEERS)
