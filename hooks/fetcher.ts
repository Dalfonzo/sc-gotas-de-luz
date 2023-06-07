import { useSession } from 'next-auth/react'
import { Unpack } from '../lib/models/common'
interface extraOptions<Response> {
  // Query params to pass to fetch function
  query?: Record<string, string | Date | undefined>
  // !IMPORTANT: next/prisma has an issue with dates, so if a response has date fields, they need to be specified to be parsed when received
  dates?: Array<keyof Response>
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
export interface usePaginationFetcherResponse<Response> {
  total: number
  lastPage: number
  records: Response
}

export const useFetcher = <Response>() => {
  const { data: sessionData } = useSession()
  const accessToken = sessionData?.user.accessToken
  
  function fetcher(url: string, options: FetcherOptions<Unpack<Response>> & { usePagination: false }): Promise<Response>
  function fetcher(
    url: string,
    options: FetcherOptions<Unpack<Response>> & { usePagination: true }
  ): Promise<usePaginationFetcherResponse<Response>>



  async function fetcher(url: string, options?: FetcherOptions<Unpack<Response>>): Promise<unknown> {
    let extra = ''
    if (options?.query) {
      extra += '?'
      if (options.usePagination) {
        options.query = { pageZero: 'true', ...options.query }
      }
      Object.entries(options.query).forEach(([name, value], index, array) => {
        if (value != undefined) {
          extra += `${name}=${value}`
          if (index !== array.length - 1) {
            extra += '&'
          }
        }
      })
    }

    const res = await fetch(url + extra, {
      headers: { ...(accessToken && { Authorization: `Bearer ${accessToken}` }) },
    })
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
