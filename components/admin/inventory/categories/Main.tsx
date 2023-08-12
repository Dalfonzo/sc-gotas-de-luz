import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { Category } from '@prisma/client'
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
import CategoryForm from './Form'
type FetchResult = (Category & { inventories: any[] })[]
type FetcherResponse = usePaginationFetcherResponse<FetchResult>
const PER_PAGE = 10

export default function CategoriesMain() {
  const router = useRouter()
  const { fetcher } = useFetcher<FetchResult>()
  const {
    data: categories,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [
      `/api/admin/inventory/category`,
      {
        usePagination: true,
        query: { page: router.query.page, size: PER_PAGE, sortBy: router.query.sortBy, dir: router.query.dir },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetchResult>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.INVENTORY })
  const fetcherInstance = useFetcherInstance()
  const [selected, setSelected] = useState<Category | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<number>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/inventory/category/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Categoría eliminada' },
  })

  const openDeleteModal = (item: Unpack<FetchResult>) =>
    item.inventories.length
      ? modals.openConfirmModal({
          title: '¿Borrar categoría?',
          centered: true,
          children: (
            <Text size="sm">
              La categoría <i>{item.name}</i> está siendo utilizada por{' '}
              <u>{item.inventories.length} elementos del inventario</u>. Por lo tanto, <b>no puede ser eliminada</b>.
            </Text>
          ),
          labels: { confirm: 'Aceptar', cancel: 'Cancelar' },
          confirmProps: {},
        })
      : modals.openConfirmModal({
          title: '¿Borrar categoría?',
          centered: true,
          children: (
            <Text size="sm">
              La categoría <i>{item.name}</i> no podrá ser recuperada.
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
        records={categories?.records}
        totalRecords={categories?.total}
        columns={[
          {
            accessor: 'name',
            title: 'Nombre',
            width: 200,
            ellipsis: true,
            sortable: true,
            render: ({ name }) => <p>{name}</p>,
          },
          {
            accessor: 'inventories',
            title: 'Inventarios Creados',
            width: 100,
            ellipsis: true,
            sortable: false,
            render: ({ inventories }) => <p>{inventories?.length}</p>,
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
        title={'Añadir categoría'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <CategoryForm
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
