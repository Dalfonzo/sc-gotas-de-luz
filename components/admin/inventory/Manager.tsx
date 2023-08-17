import { ActionIcon, Button, Flex, Group, Input, Modal, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Category, Inventory } from '@prisma/client'
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { RESOURCES } from '~/utils/constants'
import Table from '../common/table/Table'
import InventoryForm from './Form'
import { CategoriesSelect } from './categories/Select'
type FetchResult = (Inventory & { category: Category })[]
type FetcherResponse = usePaginationFetcherResponse<FetchResult>
const PER_PAGE = 10

export default function InventoryManager() {
  const router = useRouter()
  const { fetcher } = useFetcher<FetchResult>()
  const [selectedCategory, setSelectedCategory] = useState<null | string>(
    router.query.category ? String(router.query.category) : null
  )

  const {
    data: inventories,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [
      `/api/admin/inventory`,
      {
        usePagination: true,
        dates: ['updatedAt'],
        query: {
          page: router.query.page,
          size: PER_PAGE,
          sortBy: router.query.sortBy,
          dir: router.query.dir,
          ...(selectedCategory && { category: selectedCategory }),
        },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetchResult>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.INVENTORY })
  const fetcherInstance = useFetcherInstance()
  const [selected, setSelected] = useState<Inventory | undefined>(undefined)
  const [createModal, { toggle: toggleCreateModal }] = useDisclosure(false)

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/inventory/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Inventario eliminado' },
  })
  const [confirmDelete, setConfirmDelete] = useState('')
  const [openDelete, { toggle: toggleDelete }] = useDisclosure()

  const DeleteModal = (
    <Modal
      opened={openDelete}
      onClose={() => {
        toggleDelete()
        setSelected(undefined)
        setConfirmDelete('')
      }}
      centered
      title="¿Borrar inventario?"
    >
      <Stack>
        <Text size="sm">
          El inventario <i>{selected?.name}</i> será eliminado junto con todos sus registros de salidas y entradas. Esta
          acción <u>no puede ser revertida</u>.
        </Text>
        <Text size="sm">
          Para confirmar el borrado, ingresa el nombre del inventario <b>{selected?.name}</b>:
        </Text>
        <Input
          value={confirmDelete}
          onChange={(e) => setConfirmDelete(e.target.value)}
          placeholder="Confirmar nombre"
        ></Input>
        <Button
          disabled={confirmDelete !== selected?.name}
          color="red"
          loading={loadingDelete}
          onClick={async () => {
            selected && (await onDelete(selected?.id))
            toggleDelete()
            setSelected(undefined)
            setConfirmDelete('')
          }}
        >
          Borrar inventario
        </Button>
      </Stack>
    </Modal>
  )

  return (
    <>
      <Group align="end" position="right" mt="lg" mb="xl">
        <CategoriesSelect
          label="Filtrar por categoría"
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Button
          leftIcon={<IconPlus />}
          onClick={() => {
            setSelected(undefined)
            toggleCreateModal()
          }}
          color="green"
        >
          Agregar
        </Button>
      </Group>
      <Group spacing="xs" position="center" mb="md">
        <Text size="sm" component="div" color="dimmed">
          Selecciona un ojo para ver los registros de un inventario
        </Text>
        <IconEye display="inline" size="1.2rem" />
      </Group>
      <Table
        fetching={isLoading}
        idAccessor="id"
        recordsPerPage={PER_PAGE}
        records={inventories?.records}
        totalRecords={inventories?.total}
        columns={[
          {
            accessor: 'name',
            title: 'Nombre',
            width: 175,
            ellipsis: true,
            sortable: true,
            render: ({ name }) => <p>{name}</p>,
          },
          {
            accessor: 'categoryId',
            title: 'Categoría',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ category }) => <p>{category.name}</p>,
          },
          {
            accessor: 'currentQuantity',
            title: 'Disponibilidad',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: (inventory) => (
              <p>
                {inventory.currentQuantity} {`(${inventory.measure})`}
              </p>
            ),
          },
          {
            accessor: 'updatedAt',
            title: 'Última actualización',
            width: 125,
            ellipsis: true,
            sortable: true,
            render: ({ updatedAt }) => <p> hace {formatDistanceToNow(updatedAt, { locale: es })}</p>,
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 100,
            render: (item) => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                <Link href={`${router.pathname}/${item.id}`}>
                  <ActionIcon variant="light" color="blue">
                    <IconEye size="1rem" />
                  </ActionIcon>
                </Link>
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
                  <ActionIcon
                    onClick={() => {
                      setSelected(item)
                      toggleDelete()
                    }}
                    variant="light"
                    color="red"
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
        title={'Añadir inventario'}
        visible={createModal}
        onClose={toggleCreateModal}
        size="2xl"
        body={
          <InventoryForm
            initialState={selected}
            onSuccess={() => {
              mutate()
              toggleCreateModal()
            }}
          />
        }
      />
      {DeleteModal}
    </>
  )
}
