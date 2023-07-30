import { ArrowBackIcon } from '@chakra-ui/icons'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface Props extends ButtonProps {
  text?: string
  pop?: boolean
}
export const BackButton = ({ text = 'Regresar', pop = true, ...rest }: Props) => {
  const router = useRouter()
  const handleClick = () => {
    if (pop) {
      const routes = router.asPath.split('/')
      routes.pop()
      router.replace(routes.join('/'))
      return
    }
    router.back()
  }
  return (
    <Button variant="ghost" {...rest} leftIcon={<ArrowBackIcon />} onClick={handleClick}>
      {' '}
      {text}
    </Button>
  )
}
