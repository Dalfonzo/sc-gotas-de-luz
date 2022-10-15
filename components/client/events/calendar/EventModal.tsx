import { TimeIcon } from '@chakra-ui/icons'
import { Box, Center, Text } from '@chakra-ui/react'
import { compareAsc, format } from 'date-fns'
import { es } from 'date-fns/locale'
import BasicModal, { CommonModalProps } from '~/components/common/Modal'
import { EventI } from '~/lib/models/event'
import LinkButton from '../../common/link-button'

interface Props extends Omit<CommonModalProps, 'body' | 'title'> {
  event: EventI
}
function formatDate(date: Date) {
  return format(date, `d 'de' MMMM`, { locale: es })
}
export default function EventModal({ event, onClose, visible }: Props) {
  const eventBody = (
    <Box>
      <Text mb="3" fontSize="sm">
        <TimeIcon />{' '}
        {compareAsc(event.end, event.start)
          ? `${formatDate(event.start)} al ${formatDate(event.end)}`
          : `${formatDate(event.start)}`}
      </Text>
      <Text textAlign="justify">{event.description}</Text>
      {event.link && (
        <Center width="100%">
          <LinkButton variant="lnk-btn-white" mt="5" content="Ver más" href={event.link} />
        </Center>
      )}
    </Box>
  )
  return <BasicModal size="lg" title={event.title} body={eventBody} visible={visible} onClose={onClose} />
}
