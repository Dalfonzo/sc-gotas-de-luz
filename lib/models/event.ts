import { DateRange } from './common'

export interface EventI extends DateRange {
  id: number
  title: string
  description?: string
  img?: string
}
