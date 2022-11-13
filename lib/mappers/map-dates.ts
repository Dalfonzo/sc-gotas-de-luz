/* convert string properties to dates */

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
