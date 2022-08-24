export interface EventI {
  title: string
  start: string
  end?: string
  description: string
  id: any
}
export interface CalendarI {
  events: EventI[]
}
