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

interface FetcherOptions<Response> extends Pick<extraOptions<Response>, 'dates' | 'query'> {}

export type useFetcherParams<Response> = [string, FetcherOptions<Unpack<Response>>]

export const useFetcher = <Response>() => {
  const fetcher = async (url: string, options?: FetcherOptions<Unpack<Response>>): Promise<Response> => {
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

    return fetch(url + extra)
      .then((res) => res.json())
      .then((data) => (options?.dates ? parseDates(data, options.dates as string[]) : data))
  }

  return { fetcher }
}
