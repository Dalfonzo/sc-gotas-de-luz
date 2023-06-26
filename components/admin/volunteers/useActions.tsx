import { Group, Text } from '@mantine/core'
import { modals } from '@mantine/modals'
import { Volunteer } from '@prisma/client'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'

interface Props {
  afterDelete?: () => Promise<any>
  afterUpdate?: () => Promise<any>
}

export const useVolunteerActions = ({ afterDelete, afterUpdate }: Props) => {
  const fetcherInstance = useFetcherInstance()

  const { onSubmit: onUpdate, loadingSubmit: loadingUpdate } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.put(`/api/admin/volunteers/${id}/approve`, { isActive: true })
      afterUpdate && (await afterUpdate())
      return true
    },
    success: { message: 'Voluntario aprobado' },
  })

  const openUpdateModal = (item: Volunteer) =>
    modals.openConfirmModal({
      title: <b>¿Aprobar solicitud de voluntario? </b>,
      centered: true,
      children: (
        <Text size="sm">
          El voluntario será notificado respecto a tu decición.
          <Group position="apart" spacing="sm" mt="md" mb="lg">
            <span>
              Nombre: <b>{item.name}</b>{' '}
            </span>
            <span>
              Correo:<b> {item.email}</b>
            </span>
          </Group>
        </Text>
      ),
      labels: { confirm: 'Aprobar', cancel: 'Cancelar' },
      confirmProps: { color: 'green', loading: loadingUpdate },
      onConfirm: async () => await onUpdate(item.id),
    })

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/volunteers/${id}`)
      afterDelete && (await afterDelete())
      return true
    },
    success: { message: 'Voluntario eliminado' },
  })

  const openDeleteModal = (item: Volunteer) =>
    modals.openConfirmModal({
      title: <b>¿Borrar voluntario? </b>,
      centered: true,
      children: (
        <Text size="sm">
          Este registro de voluntario no podrá ser recuperado.
          <Group position="apart" spacing="sm" my="md">
            <span>
              Nombre: <b>{item.name}</b>{' '}
            </span>
            <span>
              Correo:<b> {item.email}</b>
            </span>
          </Group>
          <Text size="xs">* El registro no será eliminado en Formularios de Google</Text>
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => await onDelete(item.id),
    })
  // TODO: add on update
  return {
    onDelete: openDeleteModal,
    onApprove: openUpdateModal,
  }
}
