import { useToast } from '@chakra-ui/react'
import HCaptcha from '@hcaptcha/react-hcaptcha'
import { createRef, Dispatch, forwardRef, Ref, SetStateAction, useState } from 'react'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
interface Props {
  callback: () => Promise<any>
  setValid: Dispatch<SetStateAction<boolean>>
  setLoading: Dispatch<SetStateAction<boolean>>
}

export const useCaptcha = () => {
  const [loadingCaptcha, setLoadingCaptcha] = useState(false)
  const [validCaptcha, setValidCaptcha] = useState(false)
  const captchaRef = createRef<HCaptcha>()
  const executeCaptcha = async (fallback: () => any) => {
    if (validCaptcha) {
      fallback()
    } else {
      captchaRef.current?.execute()
    }
  }
  return {
    loadingCaptcha,
    setLoading: setLoadingCaptcha,
    setValid: setValidCaptcha,
    ref: captchaRef,
    executeCaptcha,
  }
}

const Captcha = forwardRef(({ callback, setValid, setLoading }: Props, ref: Ref<HCaptcha>) => {
  const toast = useToast()
  const fetcher = useFetcherInstance()

  function showError() {
    toast({
      description: 'Por favor intenta nuevamente',
      title: 'Error al validar Captcha',
      status: 'error',
    })
  }
  async function onCaptchaVerify(token: string, ekey: string) {
    if (!token) {
      setValid(false)
      return
    }
    try {
      setValid(true)
      setLoading(true)
      await fetcher.post('/api/hcaptcha/validate', { token, ekey })
      callback()
    } catch (error) {
      setValid(false)
      showError()
    }
    setLoading(false)
  }
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <HCaptcha
        ref={ref}
        size="invisible"
        languageOverride={'es'}
        sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITEKEY || ''}
        onVerify={onCaptchaVerify}
        onError={() => showError()}
        onExpire={() => setValid(false)}
      />
    </>
  )
})
Captcha.displayName = 'Captcha'
export default Captcha
