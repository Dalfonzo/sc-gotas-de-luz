import { ActionIcon, Button, Flex } from '@mantine/core'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import useSWR from 'swr'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import { Roles } from '~/ts/Roles'
import Table from '../../components/admin/common/table/Table'
import { withProtectedRoute } from '../../hoc/withProtectedRoute'
import { OPERATION_METHODS, RESOURCES } from '../../utils/constants'

function RolesPage() {
  const { fetcher } = useFetcher<Roles[]>()
  const {
    data: roles,
    error,
    isLoading,
  } = useSWR<Roles[]>([`/api/admin/roles`], ([url, dto]: useFetcherParams<Roles[]>) => fetcher(url, dto))
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.ROLES })
  return (
    <>
      <Button leftIcon={<IconPlus />} color="green" ml="auto" display="block" my="lg">
        Agregar
      </Button>
      <Table
        fetching={isLoading}
        idAccessor="id"
        records={roles}
        totalRecords={roles?.length}
        columns={[
          {
            accessor: 'name',
            title: 'Name',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ name }) => <p>{name}</p>,
          },
          {
            accessor: 'description',
            title: 'Description',
            width: 150,
            ellipsis: true,
            sortable: true,
            render: ({ description }) => <p>{description}</p>,
          },
          {
            accessor: 'actions',
            title: 'actions',
            width: 50,
            render: () => (
              <Flex gap="xs" align="center" pos="absolute" top="50%" sx={{ transform: 'translateY(-50%)' }}>
                {canUpdate && (
                  <ActionIcon variant="filled" color="orange">
                    <IconEdit size="1rem" />
                  </ActionIcon>
                )}
                {canDelete && (
                  <ActionIcon variant="filled" color="red">
                    <IconTrash size="1rem" />
                  </ActionIcon>
                )}
              </Flex>
            ),
          },
        ]}
      />
    </>
  )
}

export default withProtectedRoute(RolesPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.ROLES,
  title: 'roles',
})
