import InventoryMain from '~/components/admin/inventory/Main'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const InventoryPage = () => {
  return <InventoryMain />
}
export default withProtectedRoute(InventoryPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.INVENTORY,
  title: 'inventario',
})
