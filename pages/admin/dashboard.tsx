import { Box, Image, Text } from '@chakra-ui/react'
import HeadingWithDecoration from '~/components/client/common/heading-with-decoration'
import { useUserStore } from '~/store/users/useUserStore'
import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, UNPROTECTED_RESOURCES } from '../../utils/constants'

function Dashboard() {
  const { user } = useUserStore(({ user }) => ({ user }))
  return (
    <Box py="5">
      <Image src="/assets/svg/gotas_de_luz.svg" alt="asd" width={100} height={100} my="5" mx="auto" />
      <HeadingWithDecoration title="¡Cambiemos al mundo juntos!" zIndex="1" maxW="1000px" my="10" mx="auto" />
      <Text align="center" textTransform="capitalize" mt="140px" fontSize="1xl">
        Bienvenido, {user.name} 😊
      </Text>
    </Box>
  )
}

export default withProtectedRoute(Dashboard, {
  operation: OPERATION_METHODS.READ,
  resource: UNPROTECTED_RESOURCES.DASHBOARD,
  title: 'inicio',
  variant: 'no-bg',
})
