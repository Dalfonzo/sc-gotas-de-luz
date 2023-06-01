import { createReadStream, existsSync, statSync } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from 'next/dist/server/api-utils'
import path from 'path'
import { BadRequestError } from '~/lib/api/errors/api-error'
import { EXTENSION_MIMETYPES } from '~/lib/api/files/extension-mapping'
import { methodRouter } from '~/lib/api/method-router'
import prisma from '~/lib/db/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  let { url } = req.query
  url = Array.isArray(url) ? url.join('/') : url
  const get = async () => {
    if (!url) {
      throw new BadRequestError(`Missing file path in request URL`)
    }
    const fileData = await prisma.fileDb.findFirst({ where: { url: url as string } })
    if (!fileData) {
      throw new BadRequestError(`File info of ${url} not found`)
    }
    const filePath = fileData.path
    if (!existsSync(filePath)) {
      throw new ApiError(500, `File at <${fileData.path}> not found`)
    }
    const { size } = statSync(filePath)
    const ext = path.extname(filePath).slice(1)
    res.writeHead(200, {
      'Content-Type': EXTENSION_MIMETYPES[ext],
      'Content-Length': size,
    })
    const readStream = createReadStream(filePath)
    await new Promise((resolve, reject) => {
      readStream.pipe(res)
      readStream.on('end', resolve)
      readStream.on('error', reject)
    })
  }
  await methodRouter(req, res, { get })
}
