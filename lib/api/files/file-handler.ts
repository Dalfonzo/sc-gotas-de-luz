import { Prisma } from '@prisma/client'
import { File } from 'formidable'
import fs, { existsSync, mkdirSync } from 'fs'
import { NextApiRequest } from 'next'
import path from 'path'
import { BadRequestError } from '../errors/api-error'
import { parseFormAsync } from './parse-form'

interface Config {
  throwOnEmpty: boolean
}
type FileHandlerResult = Prisma.FileDbCreateArgs['data']

export const fileUploadHandler = async (req: NextApiRequest, config: Config = { throwOnEmpty: true }) => {
  // Parse request with formidable
  const { fields, files } = await parseFormAsync(req)
  req.body = { ...fields }
  if (config.throwOnEmpty && !Object.values(files).length) {
    throw new BadRequestError(`Missing files`)
  }

  const result: Record<string, FileHandlerResult> = {}
  for (let [filekey, file] of Object.entries(files)) {
    // Files are always arrays (formidable v3+)
    if (Array.isArray(file)) {
      file = file[0]
    }
    result[filekey] = saveFile(file, filekey)
  }
  return result
}

function saveFile(file: File, folder: string): FileHandlerResult {
  const baseFolder = process.env.STORAGE_PATH || '../STORAGE'
  const dest = path.join(baseFolder, folder)
  createFolder(dest)
  const fileExt = path.extname(file.originalFilename || '')
  const filename = `${file.newFilename}${fileExt}`
  fs.renameSync(file.filepath, path.join(dest, filename))
  return {
    path: path.join(dest, filename),
    name: filename,
    url: path.join(folder, filename).replaceAll('\\', '/'),
  }
}

function createFolder(dest: string) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }
}
