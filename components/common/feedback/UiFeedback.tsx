import { Box, Center } from '@chakra-ui/react'
import { ReactNode } from 'react'
import { CustomAlert } from './CustomAlert'
import { Loader } from './Loader'
interface Props {
  isLoading?: boolean
  isError?: boolean
  errorMsg?: [string, string]
  isEmpty?: boolean
  isValidating?: boolean
  emptyMsg?: [string, string]
  loadingType?: 'circle' | 'skeleton'
  children: ReactNode
}
export default function UiFeedback({
  children,
  isLoading,
  isError,
  isEmpty,
  isValidating,
  loadingType = 'circle',
  emptyMsg = ['Aún no hay datos', 'Vuelve más tarde'],
  errorMsg = ['Lo sentimos', 'Ha ocurrido un error inesperado, intenta recargar la página'],
}: Props) {
  const Centered = ({ children }: { children: ReactNode }) => (
    <Center width="100%" height="100%">
      <Box width="25rem" maxWidth="100%" display="flex" justifyContent="center" alignItems="center">
        {children}
      </Box>
    </Center>
  )
  if (isLoading || (!isLoading && isError && isValidating)) {
    return (
      <Centered>
        <Loader />
      </Centered>
    )
  }
  if (isError) {
    return (
      <Centered>
        <CustomAlert bg="transparent" height="15rem" status="error" title={errorMsg[0]} description={errorMsg[1]} />
      </Centered>
    )
  }
  if (isEmpty) {
    return (
      <Centered>
        <CustomAlert bg="transparent" height="15rem" status="info" title={emptyMsg[0]} description={emptyMsg[1]} />
      </Centered>
    )
  }
  return <>{children}</>
}
