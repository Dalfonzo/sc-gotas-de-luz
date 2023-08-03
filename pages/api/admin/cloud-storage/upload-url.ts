import { NextApiRequest, NextApiResponse } from 'next'
import { CloudStorage } from '~/lib/api/cloud-storage'
import { methodRouter } from '~/lib/api/method-router'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const post = async () => {
    const storage = new CloudStorage()
    return await storage.getUploadLink()
  }
  await methodRouter(req, res, { post })
}, RESOURCES.EVENTS)
