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
import { useUserStore } from '~/store/users/useUserStore'
import { Roles } from '~/ts/Roles'
import { User } from '~/ts/User'
import { RESOURCES } from '~/utils/constants'
import Form from './Form'

const UserMain = () => {
  const { fetcher } = useFetcher<User[]>()
  const { fetcher: rolesFetcher } = useFetcher<Roles[]>()
  const [selected, setSelected] = useState<User | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)
  const { user } = useUserStore(({ user }) => ({ user }))

  const {
    data: users,
    isLoading,
    mutate,
    isValidating,
  } = useSWR<User[]>([`/api/admin/users`], ([url, dto]: useFetcherParams<User[]>) => fetcher(url, dto), {
    revalidateOnFocus: false,
  })

  const { data: roles } = useSWR<Roles[]>([`/api/admin/roles`], ([url, dto]: useFetcherParams<Roles[]>) =>
    rolesFetcher(url, dto)
  )

  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.USERS })

  const fetcherInstance = useFetcherInstance()

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/users/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Usuario eliminado' },
  })

  const openDeleteModal = (item: User) =>
    modals.openConfirmModal({
      title: '¿Borrar Usuaro?',
      centered: true,
      children: (
        <Text size="sm">
          El usuario - <i>{item.email}</i>- no podrá ser recuperado.
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
        records={users}
        totalRecords={users?.length}
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
            accessor: 'lastName',
            title: 'Apellido',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ lastName }) => <p>{lastName}</p>,
          },
          {
            accessor: 'email',
            title: 'Correo',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ email }) => <p>{email}</p>,
          },
          {
            accessor: 'roles.name',
            title: 'Rol',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ roles }) => <p>{roles.name}</p>,
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            ellipsis: false,
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
                    disabled={!item.canBeDeleted || user.id === item.id}
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
        title={selected ? 'Editar usuario' : 'Añadir usuario'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <Form
            initialState={selected}
            roles={roles}
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

export default UserMain
