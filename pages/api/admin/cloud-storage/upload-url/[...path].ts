import httpProxy from 'http-proxy'
import { NextApiRequest, NextApiResponse } from 'next'
import httpProxyMiddleware from 'next-http-proxy-middleware'
import { CloudStorage } from '~/lib/api/cloud-storage'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { methodRouter } from '~/lib/api/method-router'
import { FREE_RESOURCE } from '~/utils/constants'
import { apiRouteAccessGuard } from '~/utils/guards/apiRouteAccessGuard'
export const config = {
  api: {
    bodyParser: false,
  },
}
export const cloudUploadMiddleware = (
  req: any,
  res: any,
  data: { url: string; token?: string; onProxyInit?: ((httpProxy: httpProxy) => void) | undefined }
) =>
  httpProxyMiddleware(req, res, {
    target: data.url,
    prependPath: true,
    changeOrigin: true,
    onProxyInit: data.onProxyInit,
    pathRewrite: [
      {
        patternStr: '^/api/admin/cloud-storage/upload-url',
        replaceStr: '',
      },
    ],
    headers: {
      ...(data.token && { authorization: `Bearer ${data.token}` }),
    },
  })

export default apiRouteAccessGuard(async (req: NextApiRequest, res: NextApiResponse) => {
  let { path } = req.query
  const parsedPath = Array.isArray(path) ? path.join('/') : path
  const put = async () => {
    const storage = new CloudStorage()
    if (!parsedPath) {
      throw new BadRequestError(`missing file path`)
    }
    const data = storage.getUpdateLink()
    const result = await cloudUploadMiddleware(req, res, data)
    res.send(result)
  }
  await methodRouter(req, res, { put })
}, FREE_RESOURCE)
