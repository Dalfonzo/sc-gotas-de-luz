export type Unpack<T> = T extends (infer U)[] ? U : T

export interface DateRange {
  start: Date
  end: Date
}

export type MapTypes<Base, From, To> = {
  [Property in keyof Base]: Base[Property] extends From ? To : Base[Property]
}

export type StringDates<T> = MapTypes<T, Date, string>
