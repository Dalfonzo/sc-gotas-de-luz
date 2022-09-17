import { Box } from '@chakra-ui/react'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { es } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { EventI } from '~/lib/models/event'
const locales = {
  es: es,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})
interface Props {
  events: EventI[]
}
const MyCalendar = ({ events }: Props) => (
  <Box marginX={['0.5rem', '2rem']}>
    <Calendar
      culture="es"
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </Box>
)
export default MyCalendar
