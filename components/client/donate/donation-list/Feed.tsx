import { Box } from '@chakra-ui/react'
import { Donation } from '@prisma/client'
import { useState } from 'react'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import { useInfiniteList } from '~/hooks/useInfiniteList'
import UiFeedback from '../../../common/feedback/UiFeedback'
import { DonationList } from './List'

export const DonationFeed = () => {
  const { fetcher } = useFetcher<Donation[]>()
  const [order, setOrder] = useState<string | undefined>(undefined)
  const {
    rows: donations,
    error: isError,
    isEmpty,
    isLoading,
    isValidating,
    isLoadingInitialData,
    InfiniteListFetcherTrigger,
  } = useInfiniteList(
    (pageIndex, previousPageData?: usePaginationFetcherResponse<Donation[]>) => {
      if (previousPageData?.lastPage && previousPageData?.lastPage < pageIndex) return null
      return [
        `/api/donation`,
        {
          dates: ['date'],
          query: {
            page: pageIndex,
            size: 8,
          },
          usePagination: true,
          pageZero: true,
        },
      ]
    },
    ([url, dto]: usePaginationFetcherParams<Donation[]>) => fetcher(url, dto),
    {}
  )
  return (
    <Box>
      <UiFeedback
        isLoading={isLoadingInitialData}
        isEmpty={isEmpty}
        isError={!!isError}
        isValidating={isValidating}
        loadingType="skeleton"
        loadingItems={4}
        emptyMsg={['Aún no hay donaciones', '¡Iremos mostrando las donaciones a penas las veriquemos!']}
        errorMsg={['Lo sentimos, ha ocurrido un error al cargar los donativos', 'Intenta cargar la página nuevamente']}
      >
        <DonationList donations={donations || []} />
        <InfiniteListFetcherTrigger />
      </UiFeedback>
    </Box>
  )
}
