import { Box, Container, Flex, Text } from '@chakra-ui/react'
import { compareAsc } from 'date-fns'
import BasicModal, { CommonModalProps } from '~/components/common/Modal'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { formatDate } from '~/lib/mappers/map-dates'
import { EventI } from '~/lib/models/event'
import { SocialMedia } from '../../common/social-media/SocialMedia'

interface Props extends Omit<CommonModalProps, 'body' | 'title'> {
  event: EventI
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
        <SocialMedia />
      </Container>
    </Box>
  )
  return <BasicModal size="lg" title={event.title} body={eventBody} visible={visible} onClose={onClose} />
}
