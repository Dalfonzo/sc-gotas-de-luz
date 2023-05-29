import { CustomFetcher, FetcherConfig } from './custom-fetcher'

export const getFetcherInstance = (config?: FetcherConfig) => {
  return new CustomFetcher(config)
}
