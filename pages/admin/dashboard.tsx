import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, UNPROTECTED_RESOURCES } from '../../utils/constants'

function Dashboard() {
  return (
    <>
      <p></p>
    </>
  )
}

export default withProtectedRoute(Dashboard, {
  operation: OPERATION_METHODS.READ,
  resource: UNPROTECTED_RESOURCES.DASHBOARD,
  title: 'tablero',
})
