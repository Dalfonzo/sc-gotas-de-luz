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
  callback: (values: T) => Promise<any>
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
      await callback(values)
      if (success) {
        toast({
          description: success.message,
          title: success.title,
          status: 'success',
        })
      }
    } catch (error) {
      // TODO: see error parsing const parsedError = parseError(error)
      setSubmitError('Ha ocurrido un error inesperado')
      toast({
        description: 'Intenta nuevamente',
        title: 'Ha ocurrido un error inesperado',
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
