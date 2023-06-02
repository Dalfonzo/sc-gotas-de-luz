import useSWR from 'swr'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import { NewsI } from '~/lib/models/news'
import { NewsArticle } from './Article'

export const ArticleProvider = ({ id }: { id: number }) => {
  const { fetcher } = useFetcher<NewsI>()
  const {
    data: news,
    error,
    isLoading,
  } = useSWR<NewsI>(
    [
      `/api/news/${id}`,
      {
        dates: ['date'],
      },
    ],
    ([url, dto]: useFetcherParams<NewsI>) => fetcher(url, dto)
  )
  return (
    <UiFeedback isLoading={isLoading} isEmpty={!news} isError={error}>
      {news && <NewsArticle news={news} />}
    </UiFeedback>
  )
}
