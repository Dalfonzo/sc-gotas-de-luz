import { ArrowBackIcon } from '@chakra-ui/icons'
import { Button, ButtonProps } from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface Props extends ButtonProps {
  text?: string
}
export const BackButton = ({ text = 'Regresar', ...rest }: Props) => {
  const router = useRouter()
  const handleClick = () => {
    router.back()
  }
  return (
    <Button variant="ghost" {...rest} leftIcon={<ArrowBackIcon />} onClick={handleClick}>
      {' '}
      {text}
    </Button>
  )
}
