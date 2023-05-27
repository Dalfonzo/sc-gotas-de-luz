import { Box } from '@chakra-ui/react'
import useSWR from 'swr'
import { NewsI } from '~/lib/models/news'
import { useFetcher, useFetcherParams } from '~/lib/swr/fetcher'
import UiFeedback from '../common/feedback/UiFeedback'
import NewsList from './card/List'
import Heading from './heading/Heading'

export const NewsFeed = () => {
  const { fetcher } = useFetcher<NewsI[]>()
  const {
    data: news,
    error,
    isLoading,
  } = useSWR([`/api/news`, { dates: ['date'] }], ([url, dto]: useFetcherParams<NewsI[]>) => fetcher(url, dto))
  return (
    <Box>
      <Heading />

      <UiFeedback
        isLoading={isLoading}
        isEmpty={!news?.length}
        error={error}
        emptyMsg={[
          'Aún no hay noticias',
          'Pronto encontrarás todos los emocionantes sucesos que tenemos que compartir',
        ]}
      >
        <NewsList news={news || []} />
      </UiFeedback>
    </Box>
  )
}
