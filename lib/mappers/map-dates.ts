/* convert string properties to dates */

import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export type DateToString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}

export function mapDates<T extends Record<string, any>, Keys extends keyof T>(
  items: T | T[],
  keys: Array<keyof T>
): { [Prop in keyof T]: Prop extends Keys ? Date : T[Prop] }[] {
  const list = Array.isArray(items) ? items : [items]
  return list.map<{ [Prop in keyof T]: Prop extends Keys ? Date : T[Prop] }>((item) => {
    Object.keys(item).forEach((key) => ((item as any)[key] = key in keys ? new Date() : item[key]))
    return item
  })
}

export function formatDate(date: Date | string, simple = false) {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  return format(date, simple ? `d-M-yyyy` : `d 'de' MMMM hh:mmaaa`, { locale: es })
}

export function formatDateTimeLocal(date: Date | string) {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  return format(date, `yyyy-MM-dd'T'HH:mm`, {})
}
