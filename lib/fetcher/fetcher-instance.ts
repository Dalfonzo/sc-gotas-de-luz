import { useSession } from 'next-auth/react'
import { CustomFetcher, FetcherConfig } from './custom-fetcher'

export const useFetcherInstance = (config?: FetcherConfig) => {
  const session = useSession()
  return new CustomFetcher({ headers: { Authorization: `Bearer ${session.data?.user.accessToken}` }, ...config })
}
