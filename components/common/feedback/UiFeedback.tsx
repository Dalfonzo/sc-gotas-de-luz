import { Box, BoxProps, Center } from '@chakra-ui/react'
import { Skeleton, Stack } from '@mantine/core'
import { ReactNode } from 'react'
import { CustomAlert } from './CustomAlert'
import { Loader } from './Loader'
interface Props extends BoxProps {
  isLoading?: boolean
  isError?: boolean
  errorMsg?: [string, string]
  isEmpty?: boolean
  isValidating?: boolean
  emptyMsg?: [string, string]
  loadingType?: 'circle' | 'skeleton'
  loadingItems?: number
  children: ReactNode
}
const SingleSkeleton = () => (
  <Stack maw="100%" w="20rem">
    {' '}
    <Skeleton height={50} circle mb="xl" />
    <Skeleton height={8} radius="xl" />
    <Skeleton height={8} mt={6} radius="xl" />
    <Skeleton height={8} mt={6} width="70%" radius="xl" />
  </Stack>
)
export const Skeletons = ({ rows = 1 }: { rows?: number }) => {
  return (
    <Stack spacing="lg">
      {Array.from({ length: rows }, (_, i) => (
        <SingleSkeleton key={i} />
      ))}
    </Stack>
  )
}

export default function UiFeedback({
  children,
  isLoading,
  isError,
  isEmpty,
  isValidating,
  loadingType = 'circle',
  loadingItems = 1,
  emptyMsg = ['Aún no hay datos', 'Vuelve más tarde'],
  errorMsg = ['Lo sentimos', 'Ha ocurrido un error inesperado, intenta recargar la página'],
  ...props
}: Props) {
  const Centered = ({ children }: { children: ReactNode }) => (
    <Box height="100%" my="auto" {...props}>
      <Center width="100%" my="10" height="100%">
        <Box width="25rem" maxWidth="100%" display="flex" justifyContent="center" alignItems="center">
          {children}
        </Box>
      </Center>
    </Box>
  )

  if (isLoading || (!isLoading && isError && isValidating)) {
    return <Centered>{loadingType === 'circle' ? <Loader /> : <Skeletons rows={loadingItems} />}</Centered>
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
