import { Box, Text, useDisclosure } from '@chakra-ui/react'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import { es } from 'date-fns/locale'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import BasicModal from '~/components/common/Modal'
import { EventI } from '~/lib/models/event'
import { useState } from 'react'
import { TimeIcon } from '@chakra-ui/icons'
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
interface Props {
  events: EventI[]
}
const MyCalendar = ({ events }: Props) => {
  const [event, setEvent] = useState<EventI | undefined>()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const handleEvent = (event: EventI) => {
    setEvent(event)
    onOpen()
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
          onSelectEvent={handleEvent}
        />
      </Box>
    </div>
  )
}
export default MyCalendar
