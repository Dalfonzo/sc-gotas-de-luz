import { ApiError } from '../api/errors/api-error'
export interface FetcherConfig extends Pick<RequestInit, 'headers' | 'credentials'> {
  baseURL?: string
  formKey?: string
}

export function joinAbsoluteUrlPath(...args: string[]) {
  return args.map((pathPart) => pathPart.replace(/(^\/|\/$)/g, '')).join('/')
}

export class CustomFetcher {
  private config?: FetcherConfig

  constructor(config?: FetcherConfig) {
    this.config = config
  }

  private async customFetch<R>(url: string, init: RequestInit) {
    const res = await fetch(this.config?.baseURL ? joinAbsoluteUrlPath(this.config.baseURL, url) : url, {
      ...this.config,
      ...init,
      headers: { ...this.config?.headers, ...init.headers },
    })

    if (!res.ok) {
      const response = await res.json()
      throw new ApiError(response.cause || response.message || `Request failed `, res.status)
    }

    const contentType = res.headers.get('Content-Type')
    if (!contentType?.includes('json')) {
      return
    }
    const data: R = await res.json()
    return data
  }
  private async sendBody<R>(url: string, method: string, body: Object, config?: FetcherConfig) {
    const content =
      body instanceof FormData
        ? {
            body: config?.formKey ? body.get(config.formKey) : body,
          }
        : {
            body: JSON.stringify(body),
            headers: {
              'Content-Type': 'application/json',
            },
          }
    return await this.customFetch<R>(url, {
      ...config,
      method: method,
      ...content,
    })
  }

  async post<R = void>(url: string, body: Object, config?: FetcherConfig) {
    return await this.sendBody<R>(url, 'POST', body, config)
  }

  async put<R = void>(url: string, body: Object, config?: FetcherConfig) {
    return await this.sendBody<R>(url, 'PUT', body, config)
  }

  async get<R = any>(url: string, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'GET',
    })
  }

  async delete<R = void>(url: string, config?: FetcherConfig) {
    return await this.customFetch<R>(url, {
      ...config,
      method: 'DELETE',
    })
  }
}
