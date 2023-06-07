import { News } from '@prisma/client'
import { GetServerSideProps } from 'next'
import NewsForm from '~/components/admin/news/NewsForm'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import { getNewsId } from '~/pages/api/admin/news/[id]'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'
interface Props {
  news?: News & { img: any }
  error?: boolean
}

function EditNews({ news, error }: Props) {
  return (
    <UiFeedback isLoading={!news && !error} isError={error}>
      {' '}
      <NewsForm initialState={news} />{' '}
    </UiFeedback>
  )
}
export default withProtectedRoute(EditNews, {
  operation: OPERATION_METHODS.CREATE,
  resource: RESOURCES.NEWS,
  title: 'noticias',
})

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const id = Number(req.params?.id)
  try {
    const current = await getNewsId(id)
    console.log({ current })
    return {
      props: { news: current },
    }
  } catch (error) {
    return {
      props: { error: true },
    }
  }
}
