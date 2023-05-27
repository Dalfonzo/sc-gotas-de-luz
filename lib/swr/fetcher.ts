import useSWR from 'swr'
import { BareFetcher, PublicConfiguration } from 'swr/_internal'
import { Unpack } from '../models/common'
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

interface FetcherOptions<Response> extends Pick<extraOptions<Response>, 'dates'> {}

export const fetcher = async <Response>(url: string, options?: FetcherOptions<Response>): Promise<Response> => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => (options?.dates ? parseDates(data, options.dates as string[]) : data))
}

export const useFetcher = <Response>(url: string, { query, dates, config }: extraOptions<Unpack<Response>>) => {
  let extra = ''
  if (query) {
    extra += '?'
    Object.entries(query).forEach(([name, value], index, array) => {
      if (value != undefined) {
        extra += `${name}=${value}`
        if (index !== array.length - 1) {
          extra += '&'
        }
      }
    })
  }
  const { data, error, ...rest } = useSWR<Response, Error>(
    [url + extra, { dates }],
    ([url, dto]: [string, FetcherOptions<Response>]) => fetcher(url, dto),
    config as any
  )
  return {
    data: data,
    isError: error,
    ...rest,
  }
}
