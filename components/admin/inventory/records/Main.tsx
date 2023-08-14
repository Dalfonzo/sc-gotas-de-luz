import { ActionIcon, Button, Flex, Group, Menu, Text, ThemeIcon, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Inventory, InventoryRecord } from '@prisma/client'
import { IconAlertTriangle, IconEdit, IconPlus, IconTransferIn, IconTransferOut } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { BackButton } from '~/components/client/common/back-button/BackButton'
import BasicModal from '~/components/common/Modal'
import { CustomSelect } from '~/components/common/custom-select/CustomSelect'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import { formatDate } from '~/lib/mappers/map-dates'
import { INVENTORY_RECORD_TYPES, RESOURCES } from '~/utils/constants'
import Table from '../../common/table/Table'
import InventoryEditForm from './EditForm'
import InventoryInputForm from './InputForm'
type FetchResult = (InventoryRecord & { expiresInDays: number | null })[]
type FetcherResponse = usePaginationFetcherResponse<FetchResult>
const PER_PAGE = 10

interface Props {
  inventory: Inventory
}

export default function InventoryRecordMain({ inventory }: Props) {
  const router = useRouter()
  const { fetcher } = useFetcher<FetchResult>()
  const [selectedType, setSelectedType] = useState<null | string>(null)

  const {
    data: inventories,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    () => {
      if (!inventory) return null
      return [
        `/api/admin/inventory/${inventory.id}/record`,
        {
          usePagination: true,
          dates: ['date', 'expirationDate'],
          query: {
            page: router.query.page,
            size: PER_PAGE,
            sortBy: router.query.sortBy,
            dir: router.query.dir,
            ...(selectedType && { filter: selectedType }),
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
  const [selected, setSelected] = useState<InventoryRecord | undefined>(undefined)
  const [createInputModal, { toggle: toggleCreateInputModal }] = useDisclosure(false)
  const [createOutputModal, { toggle: toggleCreateOutputModal }] = useDisclosure(false)

  const [editModal, { toggle: toggleEditModal }] = useDisclosure(false)

  return (
    <>
      <BackButton mb="1rem" />
      <Title size="h2">Histórico de {inventory.name}</Title>
      <Text mt="md">
        Este es el récord de entradas y salidas para este inventario. No se pueden eliminar registros, pero puedes
        anular entradas erróneas creando salidas nuevas, y viceversa.
      </Text>
      <Group align="end" position="right" mt="lg" mb="xl">
        <Text size="lg" mr="auto">
          Inventario actual: {inventory.currentQuantity} {inventory.measure}
        </Text>
        <CustomSelect
          label="Filtrar por tipo"
          data={[
            { label: 'Entradas', value: INVENTORY_RECORD_TYPES.INPUT },
            { label: 'Salidas', value: INVENTORY_RECORD_TYPES.OUTPUT },
          ]}
          selected={selectedType}
          setSelected={setSelectedType}
        />
        <Menu width={150}>
          <Menu.Target>
            <Button
              w={150}
              leftIcon={<IconPlus />}
              onClick={() => {
                setSelected(undefined)
              }}
              color="green"
            >
              Registrar
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={toggleCreateInputModal} icon={<IconTransferIn size={14} />}>
              Entrada
            </Menu.Item>
            <Menu.Item onClick={toggleCreateOutputModal} icon={<IconTransferOut size={14} />}>
              Salida
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>

      <Table
        fetching={isLoading}
        idAccessor="id"
        recordsPerPage={PER_PAGE}
        records={inventories?.records}
        totalRecords={inventories?.total}
        columns={[
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
                  {typeof item.expiresInDays == 'number' && item.expiresInDays <= 30 && (
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
      <BasicModal
        title={'Registrar entrada del inventario'}
        visible={createInputModal}
        onClose={toggleCreateInputModal}
        size="2xl"
        body={
          <InventoryInputForm
            inventory={inventory}
            onSuccess={() => {
              onMutate()
              toggleCreateInputModal()
            }}
          />
        }
      />
      <BasicModal
        title={'Registrar salida del inventario'}
        visible={createOutputModal}
        onClose={toggleCreateOutputModal}
        size="2xl"
        body={
          <div>TODO</div> /*   <InventoryForm
            initialState={selected}
            onSuccess={() => {
              onMutate()
              toggleCreateModal()
            }}
          /> */
        }
      />
      <BasicModal
        title={'Editar registro'}
        visible={editModal}
        onClose={toggleEditModal}
        size="2xl"
        body={
          selected ? (
            <InventoryEditForm
              inventory={inventory}
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
    </>
  )
}
