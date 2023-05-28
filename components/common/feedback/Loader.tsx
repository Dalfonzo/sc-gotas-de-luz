import { Spinner, SpinnerProps } from '@chakra-ui/react'
interface Props extends SpinnerProps {
  isLoading?: boolean
}
export const Loader = ({ isLoading = true, ...rest }: Props) => {
  if (isLoading)
    return <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" {...rest} />
  return <></>
}
