import { useCallback, useEffect } from 'react'

import { Box } from '@chakra-ui/react'
import { useInView } from 'react-intersection-observer'
import useSWRInfinite, { SWRInfiniteConfiguration, SWRInfiniteKeyLoader } from 'swr/infinite'
import { Loader } from '../components/common/feedback/Loader'

export const useInfiniteList = (cb: SWRInfiniteKeyLoader, fetcher: any, options: SWRInfiniteConfiguration) => {
  const { data, size, setSize, error, isValidating } = useSWRInfinite(cb, fetcher, options)

  const lastPage = data?.[0]?.lastPage
  const hasNextPage = Boolean(size <= (lastPage || 0))
  const isLoadingInitialData = !data && !error
  const isLoadingNextData = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.totalCount === 0
  const rows = data?.flatMap((d) => d.records)
  const onLoadMoreClickHandler = useCallback(() => {
    setSize((prevValue) => prevValue + 1)
  }, [setSize])

  const InfiniteListFetcherTrigger = () => {
    const { ref, inView } = useInView({
      threshold: 0,
    })

    useEffect(() => {
      if (inView && !isLoadingNextData && !isLoadingInitialData && hasNextPage) {
        onLoadMoreClickHandler()
      }
    }, [inView])

    return (
      <>
        <div ref={ref} />
        <Box
          sx={{
            width: 'fit-content',
            margin: '3rem auto 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2rem',
          }}
        >
          <Loader isLoading={isLoadingNextData} />
        </Box>
      </>
    )
  }

  return {
    lastPage,
    hasNextPage,
    isLoadingInitialData,
    isLoadingNextData,
    isEmpty,
    isValidating,
    rows,
    onLoadMoreClickHandler,
    isLoading: isLoadingInitialData || isLoadingNextData || isValidating,
    error,
    InfiniteListFetcherTrigger,
  }
}
