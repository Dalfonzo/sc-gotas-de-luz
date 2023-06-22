import { NextApiRequest, NextApiResponse } from 'next'
import { methodRouter } from '~/lib/api/method-router'
import { getGoogleInstance } from '~/lib/google/google-apis'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'
/* TODO: planificación de voluntarios
  - Mostrar listado de solicitudes de voluntariado 
  - Mostrar detalle de solicitud (form response)
  - Permitir aceptar un voluntariado y (registrar (?)) 
  - Enviar correo de notificación de postulación aceptada 

*/
export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const get = async () => {
    const formId = process.env.GOOGLE_FORM_VOLUNTEERS_ID
    const googleInstance = getGoogleInstance()
    const { page, size } = req.query
    const form = await googleInstance.get({ formId: formId })
    console.log({ page })
    const responses = await googleInstance.responses.list({
      formId: formId,
      pageSize: Number(size || 10),
      pageToken: Array.isArray(page) ? page.at(0) : page,
    })
    const titleMap: Record<string, string | null | undefined> = {}

    form.data.items?.forEach((item) => {
      titleMap[item.questionItem?.question?.questionId || ''] = item.title
    })
    return {
      nextPage: responses.data.nextPageToken,
      form: {
        formId: form.data.formId,
        linkedSheetId: form.data.linkedSheetId,
      },
      responses: responses.data.responses?.map((res) => ({
        ...res,
        answers: res.answers
          ? Object.keys(res.answers).map((answer) => ({
              ...(res.answers && {
                ...res.answers[answer],
                title: titleMap[res.answers[answer].questionId || ''],
              }),
            }))
          : null,
      })),
    }
  }
  await methodRouter(req, res, { get })
}, RESOURCES.VOLUNTEERS)
