import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import { CloudStorage } from '~/lib/api/cloud-storage'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import { RESOURCES } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  let { path } = req.query
  const parsedPath = Array.isArray(path) ? path.join('/') : path
  const put = async () => {
    const storage = new CloudStorage()
    if (!parsedPath) {
      throw new BadRequestError(`missing file path`)
    }
    const data = storage.getUpdateLink()
    req.headers.authorization = `Bearer ${data.token}`
    const result = await httpProxyMiddleware(req, res, {
      target: data.url,
      prependPath: true,
      changeOrigin: true,
      pathRewrite: [
        {
          patternStr: '^/api/admin/cloud-storage/upload-url',
          replaceStr: '',
        },
      ],
      headers: {
        authorization: `Bearer ${data.token}`,
      },
    })
    res.send(result)
  }
  await methodRouter(req, res, { put })
}, RESOURCES.EVENTS)
