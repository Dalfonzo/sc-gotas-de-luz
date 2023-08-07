import UsersMain from '~/components/admin/users/Main'
import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '../../utils/constants'

function UsersPage() {
  return <UsersMain />
}

export default withProtectedRoute(UsersPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.USERS,
  title: 'usuarios',
})
