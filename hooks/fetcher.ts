import { BareFetcher, PublicConfiguration } from 'swr/_internal'
import { Unpack } from '../lib/models/common'
interface extraOptions<Response> {
  query?: Record<string, string | Date | undefined>
  dates?: Array<keyof Response>
  config?: Partial<PublicConfiguration<Response, Error, BareFetcher<Response>>>
}

function parseDates(item: any, dates: string[]) {
  function parse(item: any) {
    if (typeof item == 'object') {
      Object.entries(item).forEach(([key, value]) => {
        if (dates.includes(key)) {
          item[key] = new Date(value as string)
        }
      })
    }
    return item
  }
  if (Array.isArray(item)) return item.map((it) => parse(it))
  else return parse(item)
}

interface FetcherOptions<Response> extends Pick<extraOptions<Response>, 'dates' | 'query'> {
  usePagination: boolean
}

export type useFetcherParams<Response> = [string, FetcherOptions<Unpack<Response>> & { usePagination: false }]
export type usePaginationFetcherParams<Response> = [string, FetcherOptions<Unpack<Response>> & { usePagination: true }]

export const useFetcher = <Response>() => {
  function fetcher(url: string, options: FetcherOptions<Unpack<Response>> & { usePagination: false }): Promise<Response>
  function fetcher(
    url: string,
    options: FetcherOptions<Unpack<Response>> & { usePagination: true }
  ): Promise<{ records: Response; total: number; lastPage: number }>

  async function fetcher(url: string, options?: FetcherOptions<Unpack<Response>>): Promise<unknown> {
    let extra = ''
    if (options?.query) {
      extra += '?'
      Object.entries(options.query).forEach(([name, value], index, array) => {
        if (value != undefined) {
          extra += `${name}=${value}`
          if (index !== array.length - 1) {
            extra += '&'
          }
        }
      })
    }

    const res = await fetch(url + extra)
    const data = await res.json()
    const parsedData = options?.dates ? parseDates(data, options.dates as string[]) : data
    if (options?.usePagination === true) {
      const total = Number(res.headers.get('total-count'))
      const lastPage = Number(res.headers.get('last-page'))
      return {
        total,
        lastPage,
        records: parsedData,
      }
    }
    return parsedData
  }

  return { fetcher }
}
