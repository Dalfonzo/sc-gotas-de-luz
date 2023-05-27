import { Alert, AlertDescription, AlertIcon, AlertProps, AlertTitle } from '@chakra-ui/react'
interface Props extends AlertProps {
  title: string
  description: string
}
export const CustomAlert = ({ title, description, ...rest }: Props) => (
  <Alert
    status="success"
    variant="subtle"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    textAlign="center"
    height="200px"
    {...rest}
  >
    <AlertIcon boxSize="40px" mr={0} />
    <AlertTitle mt={4} mb={1} fontSize="lg">
      {title}
    </AlertTitle>
    <AlertDescription maxWidth="sm">{description}</AlertDescription>
  </Alert>
)
