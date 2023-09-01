import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { DonationMethod } from '@prisma/client'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { RESOURCES } from '~/utils/constants'
import Table from '../../common/table/Table'
import MethodsForm from './Form'

type FetcherResponse = DonationMethod[]
const PER_PAGE = 10

export default function DonationMethodTable() {
  const router = useRouter()
  const { fetcher } = useFetcher<FetcherResponse>()
  const {
    data: methods,
    error,
    mutate,
    isLoading,
  } = useSWR<usePaginationFetcherResponse<FetcherResponse>>(
    [
      `/api/admin/donation/method`,
      {
        usePagination: true,
        query: { page: router.query.page, size: PER_PAGE, sortBy: router.query.sortBy, dir: router.query.dir },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetcherResponse>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.DONATIONS })
  const [selected, setSelected] = useState<DonationMethod | undefined>(undefined)
  const fetcherInstance = useFetcherInstance()
  const [isOpen, { toggle }] = useDisclosure(false)

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<number>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/donation/method/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Método eliminado' },
  })

  const openDeleteModal = (item: DonationMethod) =>
    modals.openConfirmModal({
      title: '¿Borrar método de pago?',
      centered: true,
      children: (
        <Text size="sm">
          Este método de pago <i>{item.name}</i> no podrá ser recuperado. Te en cuenta que los métodos de pago{' '}
          <u>asociados a donaciones recibidas</u> no podrán ser eliminados.
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
        onClick={() => {
          setSelected(undefined)
          toggle()
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
        records={methods?.records}
        totalRecords={methods?.total}
        recordsPerPage={PER_PAGE}
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
            accessor: 'reference',
            title: 'Datos',
            width: 250,
            ellipsis: true,
            render: ({ reference }) => (
              <Text
                lineClamp={4}
                dangerouslySetInnerHTML={{
                  __html: reference,
                }}
              />
            ),
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 85,
            render: (item) => (
              <Flex
                onClick={() => setSelected(item)}
                gap="xs"
                align="center"
                pos="absolute"
                top="50%"
                sx={{ transform: 'translateY(-50%)' }}
              >
                {canUpdate && (
                  <ActionIcon onClick={toggle} variant="light" color="orange">
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
        title={'Añadir método de pago'}
        visible={isOpen}
        onClose={toggle}
        size="2xl"
        body={
          <MethodsForm
            initialState={selected}
            onSuccess={() => {
              mutate()

              toggle()
            }}
          />
        }
      />
    </>
  )
}
