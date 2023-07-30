import { Group, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { Volunteer } from '@prisma/client'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import BasicModal from '~/components/common/Modal'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { SWR_KEYS } from '~/utils/constants'
import VolunteersForm from './Form'

interface Props {
  afterDelete?: () => Promise<any>
  afterUpdate?: () => Promise<any>
  afterCreate?: () => Promise<any>
}

export const useVolunteerActions = ({ afterDelete, afterUpdate, afterCreate }: Props) => {
  const fetcherInstance = useFetcherInstance()
  const [selected, setSelected] = useState<Volunteer | null>(null)
  const [createModal, { toggle }] = useDisclosure(false)
  const { mutate } = useSWRConfig()
  const toggleCreateModal = (selected?: Volunteer): void => {
    selected ? setSelected(selected) : setSelected(null)
    toggle()
  }

  const VolunteerModal = (
    <BasicModal
      title={'Registrar voluntario'}
      visible={createModal}
      onClose={toggleCreateModal}
      size="2xl"
      body={
        <VolunteersForm
          initialState={selected}
          onSuccess={async () => {
            afterCreate && (await afterCreate())
            toggleCreateModal()
          }}
        />
      }
    />
  )
  const { onSubmit: onUpdate, loadingSubmit: loadingUpdate } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.put(`/api/admin/volunteers/${id}/approve`, { isActive: true })
      await mutate(SWR_KEYS.PENDING_VOLUNTEERS)
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
          Asegúrate de haber chequeado todos los aspectos para aprobar su solicitud. El voluntario será notificado
          respecto a tu decición.
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
  return {
    onDelete: openDeleteModal,
    onApprove: openUpdateModal,
    toggleCreateModal,
    VolunteerModal,
  }
}
