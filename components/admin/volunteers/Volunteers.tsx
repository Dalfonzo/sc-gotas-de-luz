import { ActionIcon, Button, Flex, Text } from '@mantine/core'
import { Volunteer } from '@prisma/client'
import { IconEdit, IconEye, IconPlus, IconTrash, IconUserCheck } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import { RESOURCES } from '~/utils/constants'
import Table from '../common/table/Table'
import { GFormsButton } from './GFormsButton'
import { useVolunteerActions } from './useActions'

type FetcherResponse = usePaginationFetcherResponse<Volunteer[]>
const PER_PAGE = 10
interface Props {
  showActives: boolean
}
export default function VolunteersTable({ showActives }: Props) {
  const router = useRouter()
  const { fetcher } = useFetcher<Volunteer[]>()
  const {
    data: volunteers,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [
      `/api/admin/volunteers`,
      {
        dates: 'date',
        usePagination: true,
        query: {
          page: router.query.page,
          size: PER_PAGE,
          sortBy: router.query.sortBy,
          dir: router.query.dir,
          active: showActives,
        },
      },
    ],
    ([url, dto]: usePaginationFetcherParams<Volunteer[]>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete, canCreate } = useAccessGuard({ resource: RESOURCES.VOLUNTEERS })
  const { onDelete, VolunteerModal, toggleCreateModal, onApprove } = useVolunteerActions({
    afterDelete: mutate,
    afterUpdate: mutate,
    afterCreate: mutate,
  })

  return (
    <>
      <Flex ml="auto" w="fit-content" my="lg" gap={10}>
        <GFormsButton />
        {showActives && canCreate && (
          <Button w="10rem" leftIcon={<IconPlus />} onClick={() => toggleCreateModal()} color="green">
            Agregar
          </Button>
        )}
      </Flex>
      <Table
        fetching={isLoading}
        idAccessor="id"
        records={volunteers?.records}
        totalRecords={volunteers?.total}
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
            accessor: 'email',
            title: 'Correo',
            width: 225,
            sortable: true,
            ellipsis: true,
            render: ({ email }) => <p>{email}</p>,
          },
          {
            accessor: 'phone',
            title: 'Teléfono',
            width: 150,
            ellipsis: true,
            render: ({ phone }) => <p>{phone}</p>,
          },
          {
            accessor: 'date',
            title: 'Fecha de registro',
            width: 125,
            ellipsis: true,
            sortable: true,
            render: ({ date }) => <Text>hace {formatDistanceToNow(date, { locale: es })}</Text>,
          },

          {
            accessor: 'actions',
            title: 'Acciones',
            width: 100,
            render: (item) => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                <Link href={`/admin/volunteers/${item.id}`}>
                  <ActionIcon variant="light" color="blue">
                    <IconEye size="1rem" />
                  </ActionIcon>
                </Link>
                {canUpdate && showActives && (
                  <ActionIcon onClick={() => toggleCreateModal(item)} variant="light" color="orange">
                    <IconEdit size="1rem" />
                  </ActionIcon>
                )}
                {canUpdate && !showActives && (
                  <ActionIcon onClick={() => onApprove(item)} variant="light" color="green">
                    <IconUserCheck size="1rem" />
                  </ActionIcon>
                )}
                {canDelete && (
                  <ActionIcon onClick={() => onDelete(item)} variant="light" color="red">
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
      {VolunteerModal}
    </>
  )
}
