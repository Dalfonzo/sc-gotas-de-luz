import { SupabaseClient, createClient } from '@supabase/supabase-js'
import { randomUUID } from 'crypto'
import { CustomFetcher, joinAbsoluteUrlPath } from '~/lib/fetcher/custom-fetcher'
import { FileHandlerResult } from '../files/file-handler'
import { SUPABASE_CONSTANTS } from './constants'

export class CloudStorage {
  private static supabase: SupabaseClient
  private static storage: ReturnType<SupabaseClient['storage']['from']>
  private fetcher: CustomFetcher
  private meta: { baseUrl: string; apiKey: string; storagePrefix: string; storageName: string }
  constructor() {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_TOKEN
    const storage = process.env.SUPABASE_STORAGE
    const storageAPI = process.env.SUPABASE_STORAGE_API
    this.meta = {
      baseUrl: url || '',
      apiKey: key || '',
      storagePrefix: storageAPI || '',
      storageName: storage || '',
    }
    this.init({ url, key, storage, storageAPI })
    this.fetcher = new CustomFetcher({
      baseURL: new URL(storageAPI || '', url || '').toString(),
      headers: { Authorization: `Bearer ${key}` },
    })
  }

  private init({
    url,
    key,
    storage,
    storageAPI,
  }: {
    url?: string
    key?: string
    storage?: string
    storageAPI?: string
  }) {
    if (CloudStorage.supabase) {
      return
    }

    if (!key || !url || !storage || !storageAPI) {
      throw new Error('Missing supabase config (check .env)')
    }
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    CloudStorage.supabase = supabase
    CloudStorage.storage = supabase.storage.from(storage)

    console.log('Initiating supabase connection:', { key, url, storage, storageAPI })
  }

  async getUploadLink(config?: {
    originalUrl?: string
    extension?: string
    useAuth?: boolean
  }): Promise<{ url: string; token: string }> {
    if (config?.useAuth) {
      return {
        url: joinAbsoluteUrlPath(
          this.meta.baseUrl,
          this.meta.storagePrefix,
          SUPABASE_CONSTANTS.STORAGE.UPDATE_FILE(
            `${this.meta.storageName}/${randomUUID()}.${config?.extension || 'png'}`
          )
        ),
        token: this.meta.apiKey,
      }
    }
    const data = await CloudStorage.storage.createSignedUploadUrl(
      config?.originalUrl
        ? config.originalUrl.split(this.meta.storageName).slice(1).join('')
        : `${randomUUID()}.${config?.extension || 'png'}`
    )
    if (data.error) {
      throw new Error(`Couldn't get upload url [${data.error.message}]`)
    }
    return { url: data.data.signedUrl, token: data.data.token }
  }

  getUpdateLink() {
    return {
      url: joinAbsoluteUrlPath(this.meta.baseUrl, this.meta.storagePrefix, SUPABASE_CONSTANTS.STORAGE.UPDATE_FILE('')),
      token: this.meta.apiKey,
    }
  }

  async verifyFile(url: string): Promise<{ verified: false } | ({ verified: true } & FileHandlerResult)> {
    try {
      await this.fetcher.get(`/object/info/public/${url}`)
      return {
        verified: true,
        name: url.split('/').pop() || '',
        path: url,
        url: joinAbsoluteUrlPath(this.meta.baseUrl, this.meta.storagePrefix, SUPABASE_CONSTANTS.STORAGE.READ_FILE(url)),
        isCloud: true,
      }
    } catch (error) {
      console.error(error)
      return { verified: false }
    }
  }

  async deleteFiles(...url: string[]) {
    const data = await CloudStorage.storage.remove(url)
    if (data.error) {
      throw new Error(`Couldn't remove file [${data.error.message}]`)
    }
  }
}
