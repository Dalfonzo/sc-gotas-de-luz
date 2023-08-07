import { rm } from 'fs'
import prisma from '~/lib/db/prisma'
import { CloudStorage } from '../cloud-storage'
/* Remove actual file before update/delete */
export const beforeFileUpdate = async (fileID?: number) => {
  if (!fileID) {
    console.log('File ID not provided')
    return
  }
  const file = await prisma.fileDb.findFirst({ where: { id: fileID } })
  if (!file) {
    console.log('File record not found')
    return
  }
  if (file.isCloud) {
    // do not delete file if it's being reference by another entry
    const exists = await prisma.fileDb.findFirst({ where: { id: { not: file.id }, path: file.path } })
    if (exists) {
      return
    }
    const cloud = new CloudStorage()
    await cloud.deleteFiles(file.name)
    return
  }
  rm(file.path, (error) => {
    if (error) {
      console.log(`Couldn't remove [${file.name}] at [${file.path}]`)
    }
  })
}
