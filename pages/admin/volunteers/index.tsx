import VolunteersMain from '~/components/admin/volunteers/Main'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const VolunteersPage = () => {
  return <VolunteersMain />
}
export default withProtectedRoute(VolunteersPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.VOLUNTEERS,
  title: 'voluntarios',
})
