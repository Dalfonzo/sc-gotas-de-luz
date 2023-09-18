import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { DonationSubscriber } from '@prisma/client'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { Unpack } from '~/lib/models/common'
import { RESOURCES } from '~/utils/constants'
import Table from '../../common/table/Table'
import SubscriberForm from './Form'
type FetchResult = DonationSubscriber[]
type FetcherResponse = usePaginationFetcherResponse<FetchResult>
const PER_PAGE = 10

export default function DonationAlerts() {
  const router = useRouter()
  const { fetcher } = useFetcher<FetchResult>()
  const {
    data: subscribers,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [
      `/api/admin/donation/subscriber`,
      {
        usePagination: true,
        query: { page: router.query.page, size: PER_PAGE, sortBy: router.query.sortBy, dir: router.query.dir },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetchResult>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.DONATIONS })
  const fetcherInstance = useFetcherInstance()
  const [selected, setSelected] = useState<DonationSubscriber | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/donation/subscriber/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Subscriptor  eliminado' },
  })

  const openDeleteModal = (item: Unpack<FetchResult>) =>
    modals.openConfirmModal({
      title: '¿Remover subscriptor?',
      centered: true,
      children: (
        <Text size="sm">
          El correo <i>{item.email}</i> perteneciente <i>{item.name}</i> se eliminará y dejará de recibir alertas de
          nuevos donativos.
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => {
        await onDelete(item.id)
      },
    })
  return (
    <>
      <Text align="center" size="sm">
        Añade correos de miembros de la fundación para que reciban alertas cuando se recibe un nuevo donativo
      </Text>
      <Button
        leftIcon={<IconPlus />}
        onClick={() => {
          setSelected(undefined)
          toggleCreateModal()
        }}
        color="green"
        ml="auto"
        display="block"
        my="lg"
      >
        Agregar
      </Button>
      <Table
        fetching={isLoading}
        idAccessor="id"
        recordsPerPage={PER_PAGE}
        records={subscribers?.records}
        totalRecords={subscribers?.total}
        columns={[
          {
            accessor: 'email',
            title: 'Correo',
            width: 250,
            ellipsis: true,
            sortable: true,
            render: ({ email }) => <p>{email}</p>,
          },
          {
            accessor: 'name',
            title: 'Nombre',
            width: 200,
            ellipsis: true,
            sortable: true,
            render: ({ name }) => <p>{name}</p>,
          },

          {
            accessor: 'actions',
            title: 'Acciones',
            width: 75,
            render: (item) => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                {canUpdate && (
                  <ActionIcon
                    onClick={() => {
                      setSelected(item)
                      toggleCreateModal()
                    }}
                    variant="light"
                    color="orange"
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                )}
                {canDelete && (
                  <ActionIcon onClick={() => openDeleteModal(item)} variant="light" color="red">
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
      <BasicModal
        title={'Añadir subscriptor'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <SubscriberForm
            initialState={selected}
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
