import { ActionIcon, Flex, Group, Text, ThemeIcon, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Inventory, InventoryRecord } from '@prisma/client'
import { IconAlertTriangle, IconEdit, IconTransferOut } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import BasicModal from '~/components/common/Modal'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import { formatDate } from '~/lib/mappers/map-dates'
import { Unpack } from '~/lib/models/common'
import { INVENTORY_RECORD_TYPES, RESOURCES, SWR_KEYS } from '~/utils/constants'
import Table from '../../common/table/Table'
import InventoryEditForm from './EditForm'
import InventoryOutputForm from './OutputForm'
type FetchResult = (InventoryRecord & { expiresInDays: number | null; inventory: Inventory })[]
type FetcherResponse = usePaginationFetcherResponse<FetchResult>
const PER_PAGE = 10

export default function InventoryExpiringMain() {
  const router = useRouter()
  const { fetcher } = useFetcher<FetchResult>()
  const { mutate: mutateGlobal } = useSWRConfig()
  const {
    data: inventories,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    () => {
      return [
        `/api/admin/inventory/expiring`,
        {
          usePagination: true,
          dates: ['date', 'expirationDate'],
          query: {
            page: router.query.page,
            size: PER_PAGE,
            sortBy: router.query.sortBy,
            dir: router.query.dir,
            filter: INVENTORY_RECORD_TYPES.INPUT,
            remaining: 1,
            expiring: 1,
          },
        },
      ]
    },
    ([url, dto]: usePaginationFetcherParams<FetchResult>) => fetcher(url, dto)
  )
  const onMutate = () => {
    router.replace(router.asPath)
    mutate()
  }
  const { canUpdate } = useAccessGuard({ resource: RESOURCES.INVENTORY })
  const [selected, setSelected] = useState<Unpack<FetchResult> | undefined>(undefined)
  const [createInputModal, { toggle: toggleCreateInputModal }] = useDisclosure(false)
  const [createOutputModal, { toggle: toggleCreateOutputModal }] = useDisclosure(false)

  const [editModal, { toggle: toggleEditModal }] = useDisclosure(false)
  return (
    <>
      <Group spacing="xs" position="center" mb="md">
        <Text size="sm" component="div" color="dimmed">
          Selecciona este ícono para despachar registros de un inventario
        </Text>
        <IconTransferOut display="inline" size="1.2rem" />
      </Group>
      <Table
        fetching={isLoading}
        idAccessor="id"
        recordsPerPage={PER_PAGE}
        records={inventories?.records}
        totalRecords={inventories?.total}
        columns={[
          {
            accessor: 'inventoryId',
            title: 'Inventario',
            width: 175,
            ellipsis: true,
            sortable: true,
            render: ({ inventory }) => <p>{inventory.name}</p>,
          },
          {
            accessor: 'date',
            title: 'Fecha',
            width: 175,
            ellipsis: true,
            sortable: true,
            render: ({ date }) => <p>{formatDate(date, { altFormat: `d 'de' MMMM Y` })}</p>,
          },
          {
            accessor: 'quantity',
            title: 'Cantidad',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: (item) =>
              item.type === INVENTORY_RECORD_TYPES.INPUT ? (
                <Text color="blue">
                  +{item.quantity} <br />
                  {'(entrada)'}
                </Text>
              ) : (
                <Text color="orange">
                  {item.quantity} <br /> {'(salida)'}
                </Text>
              ),
          },
          {
            accessor: 'concept',
            title: 'Concepto',
            width: 200,
            ellipsis: true,
            render: ({ concept }) => <p>{concept}</p>,
          },
          {
            accessor: 'expirationDate',
            title: 'Fecha de vencimiento',
            width: 125,
            ellipsis: true,
            sortable: true,
            render: (item) =>
              item.type === INVENTORY_RECORD_TYPES.INPUT ? (
                <Text component="div">
                  {' '}
                  {item.expirationDate ? formatDate(item.expirationDate, { simple: true }) : <span>Sin fecha</span>}
                  {typeof item.expiresInDays == 'number' && item.expiresInDays <= 30 && item.currentQuantity > 0 && (
                    <Tooltip position="top" withArrow label={`Se vence en ${item.expiresInDays} días`}>
                      <ThemeIcon
                        style={{ verticalAlign: 'text-bottom' }}
                        ml="xs"
                        size="sm"
                        variant="light"
                        color="yellow"
                      >
                        <IconAlertTriangle />
                      </ThemeIcon>
                    </Tooltip>
                  )}
                  <br />
                  {item.currentQuantity} unidades restantes{' '}
                </Text>
              ) : (
                <p style={{ textAlign: 'center' }}>-</p>
              ),
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 100,
            render: (item) => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                {canUpdate && (
                  <ActionIcon
                    onClick={() => {
                      setSelected(item)
                      toggleCreateOutputModal()
                    }}
                    variant="light"
                    color="blue"
                  >
                    <IconTransferOut size="1rem" />
                  </ActionIcon>
                )}
                {canUpdate && (
                  <ActionIcon
                    onClick={() => {
                      setSelected(item)
                      toggleEditModal()
                    }}
                    variant="light"
                    color="orange"
                  >
                    <IconEdit size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
      {selected && (
        <BasicModal
          title={'Registrar salida del inventario'}
          visible={createOutputModal}
          onClose={toggleCreateOutputModal}
          size="2xl"
          body={
            <InventoryOutputForm
              inventory={selected.inventory}
              onSuccess={() => {
                onMutate()
                toggleCreateOutputModal()
                mutateGlobal(SWR_KEYS.EXPIRING_INVENTORY)
              }}
              initialOutputId={selected.id}
            />
          }
        />
      )}
      {selected && (
        <BasicModal
          title={'Editar registro'}
          visible={editModal}
          onClose={toggleEditModal}
          size="2xl"
          body={
            selected ? (
              <InventoryEditForm
                inventory={selected.inventory}
                initialState={selected}
                onSuccess={() => {
                  mutate()
                  toggleEditModal()
                }}
              />
            ) : (
              <div></div>
            )
          }
        />
      )}
    </>
  )
}
