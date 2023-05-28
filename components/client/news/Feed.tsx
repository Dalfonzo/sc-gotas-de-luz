import { Box } from '@chakra-ui/react'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import { useInfiniteList } from '~/hooks/useInfiniteList'
import { NewsI } from '~/lib/models/news'
import UiFeedback from '../../common/feedback/UiFeedback'
import NewsList from './card/List'
import Heading from './heading/Heading'

export const NewsFeed = () => {
  const { fetcher } = useFetcher<NewsI[]>()
  const {
    rows: news,
    error: isError,
    isEmpty,
    isLoading,
    isValidating,
    isLoadingInitialData,
    InfiniteListFetcherTrigger,
  } = useInfiniteList(
    (pageIndex, previousPageData?: usePaginationFetcherResponse<NewsI[]>) => {
      if (previousPageData?.lastPage && previousPageData?.lastPage < pageIndex) return null
      return [
        `/api/news`,
        {
          dates: ['date'],
          query: {
            page: pageIndex,
            size: 1,
          },
          usePagination: true,
        },
      ]
    },
    ([url, dto]: usePaginationFetcherParams<NewsI[]>) => fetcher(url, dto),
    {}
  )
  return (
    <Box>
      <Heading />

      <UiFeedback
        isLoading={isLoadingInitialData}
        isEmpty={isEmpty}
        isError={!!isError}
        isValidating={isValidating}
        emptyMsg={[
          'Aún no hay noticias',
          'Pronto encontrarás todos los emocionantes sucesos que tenemos que compartir',
        ]}
      >
        <NewsList news={news || []} />
        <InfiniteListFetcherTrigger />
      </UiFeedback>
    </Box>
  )
}
