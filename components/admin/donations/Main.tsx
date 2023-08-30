import { ActionIcon, Chip, Flex, Group, Indicator, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconCheck, IconEye, IconTrash, IconX } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import BasicModal from '~/components/common/Modal'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import { formatDate } from '~/lib/mappers/map-dates'
import { IncludeDonation } from '~/prisma/types'
import { RESOURCES } from '~/utils/constants'
import Table from '../common/table/Table'
import { DonationDetails } from './Detail'
import { useDonationActions } from './use-donation-actions'

type FetcherResponse = IncludeDonation[]
const PER_PAGE = 10

interface Props {
  pending?: number
}

export default function DonationMain({ pending }: Props) {
  const router = useRouter()
  const { fetcher } = useFetcher<FetcherResponse>()
  const [verifiedOnly, setVerifiedOnly] = useState<string>('all')
  const {
    data: methods,
    error,
    mutate,
    isLoading,
  } = useSWR<usePaginationFetcherResponse<FetcherResponse>>(
    [
      `/api/admin/donation`,
      {
        usePagination: true,
        dates: ['date', 'createdAt'],
        query: {
          page: router.query.page,
          size: PER_PAGE,
          sortBy: router.query.sortBy,
          dir: router.query.dir,
          ...(verifiedOnly !== 'all' && { isVerified: verifiedOnly }),
        },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<FetcherResponse>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.DONATIONS })
  const [selected, setSelected] = useState<IncludeDonation | undefined>(undefined)
  const [isOpen, { toggle }] = useDisclosure(false)

  const { onApprove, onDelete } = useDonationActions({ afterDelete: () => mutate(), afterUpdate: () => mutate() })
  return (
    <>
      <Chip.Group multiple={false} value={verifiedOnly} onChange={setVerifiedOnly}>
        <Group mb="md" position="center">
          <Chip variant="light" value="all">
            Todos
          </Chip>
          <Chip variant="light" value="true">
            Verificados
          </Chip>
          <Indicator disabled={!pending} offset={2}>
            <Chip variant="light" value="false">
              Pendientes
            </Chip>
          </Indicator>
        </Group>
      </Chip.Group>
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
            render: ({ name, isAnon }) => <p>{isAnon ? 'Anónimo' : name}</p>,
          },
          {
            accessor: 'amount',
            title: 'Monto',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: ({ amount }) => <p>{amount.toFixed(2)}</p>,
          },
          {
            accessor: 'message',
            title: 'Mensaje',
            width: 200,
            ellipsis: true,
            render: ({ message }) => <p>{message}</p>,
          },
          {
            accessor: 'isVerified',
            title: 'Estado',
            width: 100,
            ellipsis: true,
            render: ({ isVerified }) =>
              isVerified ? <Text color="green">Verificada</Text> : <Text color="orange">Pendiente</Text>,
          },
          {
            accessor: 'createAt',
            title: 'Recibida el',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: ({ createdAt }) => <Text> {formatDate(createdAt)}</Text>,
          },
          {
            accessor: 'actions',
            title: 'Acciones',
            width: 125,
            render: (item) => (
              <Flex
                onClick={() => setSelected(item)}
                gap="xs"
                align="center"
                pos="absolute"
                top="50%"
                sx={{ transform: 'translateY(-50%)' }}
              >
                <ActionIcon onClick={toggle} variant="light" color="blue">
                  <IconEye size="1rem" />
                </ActionIcon>
                {canUpdate && (
                  <ActionIcon
                    onClick={() => onApprove(item)}
                    variant="light"
                    color={item.isVerified ? 'orange' : 'green'}
                  >
                    {!item.isVerified ? <IconCheck size="1rem" /> : <IconX size="1rem" />}
                  </ActionIcon>
                )}
                {canDelete && !item.isVerified && (
                  <ActionIcon onClick={() => onDelete(item)} variant="light" color="red">
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
      <BasicModal
        title={'Detalle del donativo'}
        visible={isOpen}
        onClose={toggle}
        size="2xl"
        body={<>{selected && <DonationDetails donation={selected} />}</>}
      />
    </>
  )
}
