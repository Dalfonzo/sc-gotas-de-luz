import { Box, useBoolean, useDisclosure } from '@chakra-ui/react'
import { endOfMonth, startOfMonth } from 'date-fns/esm'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { es } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { useState } from 'react'
import { Calendar, CalendarProps, dateFnsLocalizer } from 'react-big-calendar'
import { DateRange } from '~/lib/models/common'
import { EventI } from '~/lib/models/event'
import prisma from '~/lib/prisma'
import EventModal from './EventModal'
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
interface Props extends Omit<CalendarProps, 'localizer' | 'events' | 'onSelectEvent'> {
  /*events: EventI[]
  views?: ViewsProps<EventI, object>
  defaultView?: View
  */
}

const lang = {
  week: 'Semana',
  work_week: 'Semana de trabajo',
  day: 'Día',
  month: 'Mes',
  previous: 'Anterior',
  next: 'Siguiente',
  today: 'Hoy',
  agenda: 'Resumen',
}
const MyCalendar = ({ views = { month: true }, defaultView = 'month', ...rest }: Props) => {
  const [event, setEvent] = useState<EventI | undefined>()
  const [events, setEvents] = useState<EventI[]>([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [loading, setLoading] = useBoolean(false)
  const handleEvent = (event: EventI) => {
    setEvent(event)
    onOpen()
  }
  const handleRange = (range: DateRange | Date[]) => {
    console.log({ range })
    if ('start' in range) {
      getEvents(range)
    }
  }
  const getEvents = async (range?: DateRange) => {
    if (!range) {
      const now = new Date()
      range = {
        start: startOfMonth(now),
        end: endOfMonth(now),
      }
    }
    const events = await prisma.event.findMany({
      where: { AND: { start: { gte: range.start }, end: { lte: range.end } } },
    })
    setEvents(events)
    setLoading.on()
    setLoading.off()
  }

  return (
    <div>
      {event && <EventModal event={event} visible={isOpen} onClose={onClose} />}
      <Box marginX={['0.5rem', '2rem']}>
        <Calendar
          culture="es"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectEvent={(event) => handleEvent(event as EventI)}
          messages={lang}
          defaultView={defaultView}
          views={views}
          onRangeChange={handleRange}
          {...rest}
        />
      </Box>
    </div>
  )
}
export default MyCalendar
