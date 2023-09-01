import { DonationTabs } from '~/components/admin/donations/Tabs'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const DonationPage = () => {
  return <DonationTabs />
}

export default withProtectedRoute(DonationPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.DONATIONS,
  title: 'donaciones',
})
