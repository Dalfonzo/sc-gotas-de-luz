import { useState } from 'react'
import { CLOUD_FILE_FORM_FIELD } from '~/lib/api/cloud-storage/constants'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
type FileUploadStates = 'idle' | 'error' | 'completed' | 'loading'
type UploadResult = { Key: string } | undefined
export const useCloudUpload = (config: { fileKey: string; updatePath?: string }) => {
  const shouldCloudUpload = process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE !== 'true'
  const [fileUploadState, setFileUploadState] = useState<FileUploadStates>('idle')
  const [fileReference, setFileReference] = useState<string | null>(null)
  const fetcher = useFetcherInstance()

  const onFileUpload = async (form: FormData) => {
    if (fileUploadState === 'completed') {
      fileReference && form.append(CLOUD_FILE_FORM_FIELD, fileReference)
      return
    }
    setFileUploadState('loading')
    try {
      const file = form.get(config.fileKey)
      if (!file || !shouldCloudUpload) {
        return
      }
      let result: UploadResult
      // upload file to cloud
      if (config.updatePath) {
        result = await fetcher.put<{ Key: string }>(`/api/admin/cloud-storage/upload-url/${config.updatePath}`, form, {
          formKey: config.fileKey,
        })
        // no need to set reference in file update
        form.delete(config.fileKey)
        setFileUploadState('completed')
        return
      } else {
        result = await fetcher.post<{ Key: string }>('/api/admin/cloud-storage/upload-url', form, {
          formKey: config.fileKey,
        })
      }
      if (!result) {
        throw new Error(`Couldn't get file reference`)
      }
      form.delete(config.fileKey)
      // add reference to form data
      const ref = result?.Key
      setFileReference(ref)
      form.append(CLOUD_FILE_FORM_FIELD, ref)
      setFileUploadState('completed')
    } catch (error) {
      setFileUploadState('error')
      throw error
    }
  }

  return {
    onFileUpload,
    fileUploadState,
  }
}
