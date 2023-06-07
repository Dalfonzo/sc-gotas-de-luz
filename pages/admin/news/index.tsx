import NewsMain from '~/components/admin/news/Main'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const NewsPage = () => {
  return <NewsMain />
}
export default withProtectedRoute(NewsPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.NEWS,
  title: 'noticias',
})
