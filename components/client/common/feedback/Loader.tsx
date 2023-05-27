import { Spinner, SpinnerProps } from '@chakra-ui/react'
interface Props extends SpinnerProps {}
export const Loader = (props: Props) => (
  <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" {...props} />
)
