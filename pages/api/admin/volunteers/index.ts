import { Prisma, Volunteer } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { paginationHandler } from '~/lib/api/handler'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'
/* TODO: planificación de voluntarios
  - Mostrar listado de solicitudes de voluntariado 
  - Mostrar detalle de solicitud (form response)
  - Permitir aceptar un voluntariado y (registrar (?)) 
  - Enviar correo de notificación de postulación aceptada 

*/
export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const model = prisma.volunteer
  const get = async () => {
    const { active } = req.query
    await paginationHandler<Volunteer[], Prisma.VolunteerFindManyArgs>(req, res, model, {
      orderBy: { date: 'desc' },
      where: {
        ...(active && { isActive: active !== 'false' }),
      },
    })
  }
  await methodRouter(req, res, { get })
}, RESOURCES.VOLUNTEERS)
