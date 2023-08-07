import RolesMain from '~/components/admin/roles/Main'
import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '../../utils/constants'

function RolesPage() {
  return <RolesMain />
}

export default withProtectedRoute(RolesPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.ROLES,
  title: 'roles',
})
