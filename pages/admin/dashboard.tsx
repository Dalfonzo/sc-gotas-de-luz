import { Box, Image, Text } from '@chakra-ui/react'
import { useUserStore } from '~/store/users/useUserStore'
import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, UNPROTECTED_RESOURCES } from '../../utils/constants'

function Dashboard() {
  const { user } = useUserStore(({ user }) => ({ user }))
  return (
    <Box py="5">
      <Text variant="subtitle-no-decoration" align="center" textTransform="capitalize">
        ¡Bienvenido {user.name}!
      </Text>
      <Image src="/assets/svg/gotas_de_luz.svg" alt="asd" width={250} height={250} mx="auto" my="20" />
    </Box>
  )
}

export default withProtectedRoute(Dashboard, {
  operation: OPERATION_METHODS.READ,
  resource: UNPROTECTED_RESOURCES.DASHBOARD,
  title: 'inicio',
})
