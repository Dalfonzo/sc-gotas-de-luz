import { rm } from 'fs'
import prisma from '~/lib/db/prisma'
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
  rm(file.path, (error) => {
    if (error) {
      console.log(`Couldn't remove [${file.name}] at [${file.path}]`)
    }
  })
}
