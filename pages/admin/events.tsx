import EventsMain from '~/components/admin/events/Main'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const NewsPage = () => {
  return <EventsMain />
}
export default withProtectedRoute(NewsPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.EVENTS,
  title: 'calendario',
})
