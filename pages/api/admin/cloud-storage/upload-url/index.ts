import { NextApiRequest, NextApiResponse } from 'next'
import { CloudStorage } from '~/lib/api/cloud-storage'
import { methodRouter } from '~/lib/api/method-router'
import { FREE_RESOURCE } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'
import { cloudUploadMiddleware } from './[...path]'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  const storage = new CloudStorage()

  const get = async () => {
    return await storage.getUploadLink()
  }
  const post = async () => {
    const data = await storage.getUploadLink({ useAuth: true })
    await cloudUploadMiddleware(req, res, { url: data.url, token: data.token })
  }
  await methodRouter(req, res, { get, post })
}, FREE_RESOURCE)
