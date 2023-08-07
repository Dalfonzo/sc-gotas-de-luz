import { Prisma } from '@prisma/client'
import { File } from 'formidable'
import fs, { existsSync, mkdirSync } from 'fs'
import { NextApiRequest } from 'next'
import path from 'path'
import { CLOUD_FILE_FORM_FIELD } from '../cloud-storage/constants'
import { BadRequestError } from '../errors/api-error'
import { checkCloudUpload } from '../use-cloud-upload'
import { parseFormAsync } from './parse-form'

interface Config {
  throwOnEmpty: boolean
}
interface CreateConfig {
  throwOnEmpty: true
}
interface UpdateConfig {
  throwOnEmpty: false
}
export type FileHandlerResult = Prisma.FileDbCreateArgs['data']

export function fileUploadHandler(req: NextApiRequest, config: CreateConfig): Promise<FileHandlerResult>
export function fileUploadHandler(req: NextApiRequest, config: UpdateConfig): Promise<FileHandlerResult | null>
export async function fileUploadHandler(
  req: NextApiRequest,
  config: Config = { throwOnEmpty: true }
): Promise<FileHandlerResult | null> {
  const { fields, files } = await parseFormAsync(req)
  req.body = { ...fields }
  // just check file is uploaded for cloud storage
  if (!isLocalStorage()) {
    const fileRef: string = req.body[CLOUD_FILE_FORM_FIELD]
    delete req.body[CLOUD_FILE_FORM_FIELD]
    const checkFile = await checkCloudUpload(fileRef)
    if (!checkFile.verified && !config.throwOnEmpty) {
      return null
    }
    if (!checkFile.verified) {
      throw new BadRequestError(`Missing files`)
    }
    return {
      name: checkFile.name,
      path: checkFile.path,
      url: checkFile.url,
    }
  }
  // Else parse request with formidable

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
  return Object.values(result)[0]
}
export const isLocalStorage = () => process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true'

function saveFile(file: File, folder: string): FileHandlerResult {
  const baseFolder = process.env.STORAGE_PATH || '../STORAGE'
  const fileExt = path.extname(file.originalFilename || '')
  const filename = `${file.newFilename}${fileExt}`
  if (!isLocalStorage()) {
    return {
      path: file.filepath,
      url: '',
      name: filename,
    }
  }
  const dest = path.join(baseFolder, folder)
  createFolder(dest)

  fs.renameSync(file.filepath, path.join(dest, filename))
  return {
    path: path.join(dest, filename),
    name: filename,
    url: path.join(folder, filename).replaceAll('\\', '/'),
    isCloud: false,
  }
}

function createFolder(dest: string) {
  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true })
  }
}
