import FullCalendar from '@fullcalendar/react'

import dayGridPlugin from '@fullcalendar/daygrid'
import { CalendarI } from './CalendarI'

const Calendar = ({ events }: CalendarI) => {
  return <FullCalendar plugins={[dayGridPlugin]} events={events} initialView="dayGridMonth" />
}

export default Calendar
