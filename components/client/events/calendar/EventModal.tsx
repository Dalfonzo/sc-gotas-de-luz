import { Box, Container, Flex, Icon, IconButton, Text } from '@chakra-ui/react'
import { compareAsc, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'
import BasicModal, { CommonModalProps } from '~/components/common/Modal'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { EventI } from '~/lib/models/event'

interface Props extends Omit<CommonModalProps, 'body' | 'title'> {
  event: EventI
}
function formatDate(date: Date | string) {
  if (typeof date == 'string') {
    date = new Date(date)
  }
  return format(date, `d 'de' MMMM hh:mmaaa`, { locale: es })
}
export default function EventModal({ event, onClose, visible }: Props) {
  const eventBody = (
    <Box>
      <Flex mb="3" justify="space-between">
        {/* <TimeIcon /> */}{' '}
        <Text fontSize="sm">
          <b>Inicia: </b>
          {formatDate(event.start)}
        </Text>
        {compareAsc(event.end, event.start) > 0 && (
          <Text fontSize="sm">
            <b>Hasta:</b> {formatDate(event.end)}
          </Text>
        )}
      </Flex>

      {event.img && <ApiImg mb="3" url={event.img} alt="" width="100%" fit="cover" height="12rem" />}
      <Text mb="3" textAlign="justify">
        {event.description}
      </Text>
      <Text textAlign="right" fontSize="sm">
        Para más detalles, contáctanos:
      </Text>
      <Container width="fit-content" display="block" ml="auto" mr={0} pr={0}>
        <IconButton variant="ghost" aria-label="Whatsapp">
          <Icon as={FaWhatsapp} />
        </IconButton>
        <IconButton variant="ghost" aria-label="Instagram">
          <Icon as={FaInstagram} />
        </IconButton>
      </Container>
    </Box>
  )
  return <BasicModal size="lg" title={event.title} body={eventBody} visible={visible} onClose={onClose} />
}
