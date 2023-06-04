import { AdminLayout } from 'layouts/Admin'
import NewsForm from '~/components/admin/news/NewsForm'

export default function AddNews() {
  return (
    <AdminLayout title="noticias">
      <NewsForm />
    </AdminLayout>
  )
}
