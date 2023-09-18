import { useToast } from '@chakra-ui/react'
import { useState } from 'react'
// import { parseError } from '~/utils/parseError'

interface ErrorMap {
  [x: number]: string
}

export default function useSubmitHandler<T>({
  callback,
  //errorMap,
  success,
}: {
  callback: (values: T) => Promise<boolean | undefined>
  //errorMap: ErrorMap
  success?: {
    message: string
    title?: string
  }
}) {
  const toast = useToast()
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [submitError, setSubmitError] = useState<string | undefined>(undefined)
  const onSubmit = async (values: T) => {
    setLoadingSubmit(true)
    setSubmitError(undefined)
    try {
      const result = await callback(values)
      if (success && result) {
        toast({
          description: success.message,
          title: success.title,
          status: 'success',
        })
      }
      setLoadingSubmit(false)
      return result
    } catch (error: any) {
      // TODO: see error parsing const parsedError = parseError(error)
      let errorMsg = 'Ha ocurrido un error inesperado'
      let errorDescription = 'Intenta nuevamente'

      if (error?.cause || error?.message) {
        errorMsg = 'Ha ocurrido un error'
        errorDescription = error.cause || error.message
      }

      setSubmitError(errorMsg)
      toast({
        description: errorDescription,
        title: errorMsg,
        status: 'error',
      })
    }
    setLoadingSubmit(false)
  }
  return {
    onSubmit,
    submitError,
    loadingSubmit,
    setLoadingSubmit,
  }
}
