import { CloudStorage } from './cloud-storage'

// middleware function to check if a certain file was uploaded before continuing with request
export const checkCloudUpload = async (fileUrl: string) => {
  const cloudStorage = new CloudStorage()
  return await cloudStorage.verifyFile(fileUrl)
}
