import NewsForm from '~/components/admin/news/NewsForm'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

function AddNews() {
  return <NewsForm />
}
export default withProtectedRoute(AddNews, {
  operation: OPERATION_METHODS.CREATE,
  resource: RESOURCES.NEWS,
  title: 'noticias',
})
