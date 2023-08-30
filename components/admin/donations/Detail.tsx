import { ActionIcon, Box, Button, Card, Group, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconCheck,
  IconCheckbox,
  IconClock,
  IconExternalLink,
  IconHeartHandshake,
  IconMessage,
  IconTrash,
  IconUser,
  IconX,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { mutate } from 'swr'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import useAccessGuard from '~/hooks/useAccessGuard'
import { formatDate } from '~/lib/mappers/map-dates'
import { IncludeDonation } from '~/prisma/types'
import { RESOURCES } from '~/utils/constants'
import { useDonationActions } from './use-donation-actions'

interface Props {
  donation: IncludeDonation
}

export const DonationDetails = ({ donation }: Props) => {
  const afterAction = () => {
    mutate('/api/admin/donation')
  }
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.DONATIONS })
  const { onDelete, onApprove } = useDonationActions({
    afterDelete: async () => {
      afterAction()
    },
    afterUpdate: async () => {
      afterAction()
    },
  })
  const brief = [
    {
      Icon: IconUser,
      value: donation.name || 'Anónimo',
      label: 'Nombre',
    },
    {
      Icon: IconMessage,
      value: donation.message,
      label: 'Mensaje',
    },
    {
      Icon: IconHeartHandshake,
      value: donation.amount.toFixed(2),
      label: 'Monto',
    },
    {
      Icon: IconClock,
      value: 'Hace ' + formatDistanceToNow(donation.createdAt, { locale: es }),
      label: 'Fecha de registro',
    },
    {
      Icon: IconCheckbox,
      value: donation.isVerified ? 'APROBADO' : 'PENDIENTE',
      label: 'Estatus de donativo',
    },
  ]
  const BriefCard = (
    <Box>
      <Text fz="lg" fw="bold" mb="md">
        Resumen
      </Text>
      <Card mx="auto" padding="lg" radius="md">
        <SimpleGrid
          spacing="xl"
          cols={3}
          breakpoints={[
            { maxWidth: 'md', cols: 2, spacing: 'sm' },
            { maxWidth: 'xs', cols: 1, spacing: 'sm' },
          ]}
        >
          {brief.map((item, index) => (
            <Box key={index}>
              <Group spacing="xs">
                <item.Icon color="#868e96" size={20} />

                <Text color="dimmed">{item.label}</Text>
              </Group>
              <Text>{item.value}</Text>
            </Box>
          ))}
        </SimpleGrid>
      </Card>
    </Box>
  )
  const Actions = (
    <Box mb="lg">
      <Text fz="lg" fw="bold" mb="md">
        Acciones
      </Text>
      <Text mb="lg">Puedes aprobar el donativo recibido o eliminar el registro:</Text>
      <Group mt="lg" position="left">
        {!donation.isVerified && canUpdate && (
          <Button onClick={() => onApprove(donation)} color="green" leftIcon={<IconCheck />}>
            Aprobar
          </Button>
        )}
        {donation.isVerified && canUpdate && (
          <Button onClick={() => onApprove(donation)} color="orange" leftIcon={<IconX />}>
            Anular
          </Button>
        )}
        {!donation.isVerified && canDelete && (
          <Button color="red" onClick={() => onDelete(donation)} leftIcon={<IconTrash />}>
            Eliminar
          </Button>
        )}
      </Group>
    </Box>
  )
  const Reference = (
    <Box mb="lg">
      <Text fz="lg" fw="bold" mb="md">
        Comprobante
      </Text>
      <Group mx="sm" position="apart">
        <Text>
          <Text component="span" color="dimmed">
            Referencia
          </Text>
          <br />
          {donation.reference}
        </Text>
        <Text>
          <Text component="span" color="dimmed">
            Forma de pago
          </Text>
          <br />
          {donation.method.name}
        </Text>
        <Text>
          <Text component="span" color="dimmed">
            Fecha de pago
          </Text>
          <br />
          {formatDate(donation.date, { simple: true })}
        </Text>
      </Group>

      <Box h="auto" pos="relative" mt="md" w="100%">
        <ActionIcon pos="absolute" right="10%" bottom="0">
          <IconExternalLink width={32} height={32} />
        </ActionIcon>
        <Link href={donation.img.url} target="_blank">
          <ApiImg alt="Comprobante" objectFit="contain" h="15rem" w="100%" url={donation.img} />
        </Link>
      </Box>
    </Box>
  )
  return (
    <Stack maw="1080px" mb="lg" spacing="2rem">
      {BriefCard}
      {Reference}
      {/*       {Actions}
       */}{' '}
    </Stack>
  )
}
