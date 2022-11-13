import useSWR from 'swr'
import { Unpack } from '../models/common'
interface extraOptions<Response> {
  query?: Record<string, string | Date | undefined>
  dates?: Array<keyof Response>
}

function parseDates<T>(item: any, dates: string[]) {
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

export const fetcher = async <Response>(
  url: string,
  options?: Pick<extraOptions<Response>, 'dates'>
): Promise<Response> => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => (options?.dates ? parseDates(data, options.dates as string[]) : data))
}

export const useFetcher = <Response>(url: string, { query, dates }: extraOptions<Unpack<Response>>) => {
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

  const { data, error } = useSWR<Response, Error>([url + extra, { dates }], fetcher)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
  }
}
