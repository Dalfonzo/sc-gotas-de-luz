import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '../../utils/constants'

function Dashboard() {
  return (
    <>
      <p>test</p>
    </>
  )
}

export default withProtectedRoute(Dashboard, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.NEWS,
  title: 'tablero',
})
