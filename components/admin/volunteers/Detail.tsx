import { Box, Button, Card, Flex, Group, List, SimpleGrid, Stack, Text } from '@mantine/core'
import {
  IconCalendar,
  IconCheck,
  IconCheckbox,
  IconClock,
  IconEdit,
  IconMail,
  IconPhone,
  IconTrash,
  IconUser,
} from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BackButton } from '~/components/client/common/back-button/BackButton'
import useAccessGuard from '~/hooks/useAccessGuard'
import { VolunteerDetailResponse } from '~/pages/api/admin/volunteers/[id]'
import { RESOURCES } from '~/utils/constants'
import { GFormsButton } from './GFormsButton'
import { useVolunteerActions } from './useActions'
interface Props {
  volunteer: VolunteerDetailResponse
}
export const VolunteerDetails = ({ volunteer }: Props) => {
  const router = useRouter()
  const [isApproved, setIsApproved] = useState(volunteer.values.isActive)
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.VOLUNTEERS })
  const { onDelete, onApprove, toggleCreateModal, VolunteerModal } = useVolunteerActions({
    afterDelete: async () => {
      await router.replace('/admin/volunteers')
    },
    afterUpdate: async () => {
      setIsApproved(true)
    },
    afterCreate: async () => {
      await router.replace(router.asPath)
    },
  })
  const brief = [
    {
      Icon: IconUser,
      value: volunteer.values.name,
      label: 'Nombre',
    },
    {
      Icon: IconMail,
      value: volunteer.values.email,
      label: 'Correo',
    },
    {
      Icon: IconPhone,
      value: volunteer.values.phone,
      label: 'Teléfono',
    },
    {
      Icon: IconCalendar,
      value: volunteer.values.birthDate,
      label: 'Fecha de nacimiento',
    },
    {
      Icon: IconClock,
      value: 'Hace ' + formatDistanceToNow(volunteer.values.date, { locale: es }),
      label: 'Fecha de registro',
    },
    {
      Icon: IconCheckbox,
      value: isApproved ? 'APROBADO' : 'PENDIENTE',
      label: 'Estatus de voluntario',
    },
  ]
  const BriefCard = (
    <Box>
      <Text fz="xl" fw="bold" mb="md">
        Resumen
      </Text>
      <Card mx="auto" shadow="sm" padding="lg" radius="md" withBorder>
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
      <Text fz="xl" fw="bold" mb="md">
        Acciones
      </Text>
      <Text mb="lg">Puedes aprobar las solicitudes de voluntariado pendientes o eliminar el registro:</Text>
      <Group mt="lg" position="left">
        {!isApproved && canUpdate && (
          <Button onClick={() => onApprove(volunteer.values)} color="green" leftIcon={<IconCheck />}>
            Aprobar
          </Button>
        )}
        {isApproved && canUpdate && (
          <Button
            onClick={() => {
              toggleCreateModal(volunteer.values)
            }}
            color="orange"
            leftIcon={<IconEdit />}
          >
            Editar
          </Button>
        )}
        {canDelete && (
          <Button color="red" onClick={() => onDelete(volunteer.values)} leftIcon={<IconTrash />}>
            Eliminar
          </Button>
        )}
      </Group>
    </Box>
  )
  const Form = (
    <Stack mt="md">
      {' '}
      <Flex justify="space-between">
        <Text fz="xl" fw="bold" mb="md">
          Formulario
        </Text>
        <GFormsButton response={volunteer.values.formReference} />
      </Flex>
      {volunteer.form ? (
        <Box w="100%">
          <Text mb="lg">
            Estas son las respuestas proporcionadas por el voluntario al llenar el formulario de Google:
          </Text>
          {volunteer.form.answers?.map((answer, index) => (
            <Box key={index} mb="md">
              <Text>{answer.title}</Text>
              <List ml="md">
                {answer.textAnswers?.answers?.map((ans, idx) => (
                  <List.Item key={idx}>{ans.value}</List.Item>
                ))}
              </List>
            </Box>
          ))}
        </Box>
      ) : (
        <Box>
          <Text align="center">Este voluntario no está asociado a un formulario de Google.</Text>
        </Box>
      )}
    </Stack>
  )
  return (
    <Stack maw="1080px" spacing="2rem">
      <BackButton mr="auto" />
      <Text>
        Acá podrás ver el detalle del voluntario <i>{volunteer.values.name}</i>, junto con sus respuestas del formulario
        de registro y las{' '}
        <Text color="cyan" span style={{ cursor: 'pointer' }}>
          {' '}
          acciones
        </Text>{' '}
        que se pueden efectuar sobre este registro.
      </Text>
      {BriefCard}
      {Form}
      {Actions}
      {VolunteerModal}
    </Stack>
  )
}
