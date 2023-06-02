import { GetServerSideProps } from 'next'
import { ArticleProvider } from '~/components/client/news/article/Provider'
import ClientLayout from '~/layouts/Client'

interface Props {
  id: number
}

const NewsArticlePage = ({ id }: Props) => {
  return (
    <ClientLayout>
      <ArticleProvider id={id} />
    </ClientLayout>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const id = Number(req.params?.id)
  return {
    props: { id },
  }
}

export default NewsArticlePage
