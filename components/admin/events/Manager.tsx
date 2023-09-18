import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { Event } from '@prisma/client'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { formatDate } from '~/lib/mappers/map-dates'
import { RESOURCES } from '~/utils/constants'
import Table from '../common/table/Table'
import EventsForm from './Form'

type FetcherResponse = usePaginationFetcherResponse<(Event & { img: any })[]>
const PER_PAGE = 10

export default function EventsManager() {
  const router = useRouter()
  const { fetcher } = useFetcher<(Event & { img: any })[]>()
  const {
    data: events,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [
      `/api/admin/events`,
      {
        dates: ['start', 'end'],
        usePagination: true,
        query: { page: router.query.page, size: PER_PAGE, sortBy: router.query.sortBy, dir: router.query.dir },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<Event[]>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete, canCreate } = useAccessGuard({ resource: RESOURCES.EVENTS })
  const fetcherInstance = useFetcherInstance()
  const [selected, setSelected] = useState<(Event & { img: any }) | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<number>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/events/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Noticia eliminada' },
  })

  const openDeleteModal = (item: Event) =>
    modals.openConfirmModal({
      title: '¿Borrar artículo?',
      centered: true,
      children: (
        <Text size="sm">
          Este evento -titulado <i>{item.title}</i>- no podrá ser recuperado.
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => await onDelete(item.id),
    })
  return (
    <>
      {canCreate && (
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
      )}
      <Table
        fetching={isLoading}
        idAccessor="id"
        recordsPerPage={PER_PAGE}
        records={events?.records}
        totalRecords={events?.total}
        columns={[
          {
            accessor: 'title',
            title: 'Título',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ title }) => <p>{title}</p>,
          },
          {
            accessor: 'description',
            title: 'Cuerpo',
            width: 250,
            ellipsis: true,
            sortable: true,
            render: ({ description }) => <Text lineClamp={3}>{description}</Text>,
          },
          {
            accessor: 'start',
            title: 'Inicio',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: ({ start }) => <Text> {formatDate(start)}</Text>,
          },
          {
            accessor: 'end',
            title: 'Fin',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: ({ end }) => <Text> {formatDate(end)}</Text>,
          },
          {
            accessor: 'img',
            title: 'Portada',
            width: 125,
            render: ({ img }) => <ApiImg objectFit="cover" h="5rem" w="100%" url={img} />,
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 85,
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
        title={'Añadir evento'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <EventsForm
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
