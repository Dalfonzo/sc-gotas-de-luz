import { DateRange, StringDates } from './common'

export interface EventI extends DateRange {
  id: number
  title: string
  description?: string
  img?: string
}

export type EventApiI = StringDates<EventI>
