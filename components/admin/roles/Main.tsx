import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useState } from 'react'
import useSWR from 'swr'
import Table from '~/components/admin/common/table/Table'
import BasicModal from '~/components/common/Modal'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { Resources } from '~/ts/Resources'
import { Roles } from '~/ts/Roles'
import { RESOURCES } from '~/utils/constants'
import RolesForm from './RolesForm'

const RolesMain = () => {
  const { fetcher } = useFetcher<Roles[]>()
  const [selected, setSelected] = useState<Roles | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)

  const {
    data: roles,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<Roles[]>([`/api/admin/roles`], ([url, dto]: useFetcherParams<Roles[]>) => fetcher(url, dto), {
    revalidateOnFocus: false,
  })

  const { data: resources } = useSWR<Roles[]>([`/api/admin/resources`], ([url, dto]: useFetcherParams<Resources[]>) =>
    fetcher(url, dto)
  )

  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.ROLES })

  const fetcherInstance = useFetcherInstance()

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/roles/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Rol eliminado' },
  })

  const openDeleteModal = (item: Roles) =>
    modals.openConfirmModal({
      title: '¿Borrar rol?',
      centered: true,
      children: (
        <Text size="sm">
          El rol - <i>{item.name}</i>- no podrá ser recuperado.
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => await onDelete(item.id),
    })

  return (
    <>
      <Button
        leftIcon={<IconPlus />}
        color="green"
        ml="auto"
        display="block"
        my="lg"
        onClick={() => {
          toggleCreateModal()
          setSelected(undefined)
        }}
      >
        Agregar
      </Button>
      <Table
        fetching={isLoading || isValidating}
        idAccessor="id"
        records={roles}
        totalRecords={roles?.length}
        columns={[
          {
            accessor: 'name',
            title: 'Nombre',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ name }) => <p>{name}</p>,
          },
          {
            accessor: 'description',
            title: 'Descripción',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ description }) => <p>{description}</p>,
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 100,
            render: (item) => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                {canUpdate && (
                  <ActionIcon
                    variant="light"
                    color="orange"
                    onClick={() => {
                      setSelected(item)
                      toggleCreateModal()
                    }}
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                )}
                {canDelete && (
                  <ActionIcon
                    variant="light"
                    color="red"
                    onClick={() => openDeleteModal(item)}
                    disabled={!item.canBeDeleted}
                  >
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
      <BasicModal
        title={'Añadir rol'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <RolesForm
            readOnly={!selected?.canBeDeleted}
            initialState={selected}
            resources={resources as Resources[]}
            onSuccess={() => {
              mutate()
              toggleCreateModal()
            }}
          />
        }
      />
    </>
  )
}

export default RolesMain
