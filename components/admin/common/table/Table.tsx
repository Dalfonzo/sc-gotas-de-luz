import { Center, Stack, Text, ThemeIcon, createStyles } from '@mantine/core'
import { IconDatabaseOff } from '@tabler/icons-react'
import { DataTable, DataTableProps, DataTableSortStatus } from 'mantine-datatable'
import { useRouter } from 'next/router'
import { useState } from 'react'

function Table<T>({
  columns,
  idAccessor,
  records = [],
  totalRecords,
  recordsPerPage,
  fetching,
  ..._rest
}: Pick<DataTableProps<T>, 'columns' | 'idAccessor' | 'records' | 'totalRecords' | 'fetching' | 'recordsPerPage'>) {
  const RECORDS_PER_PAGE = 10
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(Number(router.query.page) || 1)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: (router.query.sortBy as string) || 'id',
    direction: (router.query.dir as DataTableSortStatus['direction']) || 'desc',
  })

  const onSortStatusChangeHandler = (status: DataTableSortStatus) => {
    setCurrentPage(1)
    setSortStatus(status)
    router.replace({
      query: {
        ...router.query,
        sortBy: status.columnAccessor,
        dir: status.direction,
      },
    })
  }

  const onPageChangeHandler = (page: number) => {
    setCurrentPage(page)
    router.replace({
      // ...router,
      query: { ...router.query, page },
    })
  }

  const useStyles = createStyles((theme) => ({
    pagination: {
      color: theme.colors.gray[5],
    },
  }))

  const { classes } = useStyles()

  return (
    <DataTable
      paginationColor="cyan"
      recordsPerPage={recordsPerPage || RECORDS_PER_PAGE}
      page={currentPage}
      onPageChange={onPageChangeHandler}
      classNames={classes}
      emptyState={
        <Center>
          <Stack align="center" spacing="0">
            <ThemeIcon color="gray" variant="light">
              <IconDatabaseOff />
            </ThemeIcon>
            <Text fz="sm">Sin registros</Text>
          </Stack>
        </Center>
      }
      sx={(theme) => ({
        margin: 'auto',
        padding: `${theme.spacing.lg} !important`,
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          width: 'calc(100vw - 4rem)',
        },
        [`@media (min-width: ${theme.breakpoints.md}px)`]: {
          width: 'calc(100% - 2rem)',
        },
        thead: {
          padding: `${theme.spacing.lg} !important`,
          fontSize: theme.fontSizes.md,
          '& > tr th': {
            fontSize: theme.fontSizes.md,
          },
        },
        tbody: {
          fontSize: theme.fontSizes.md,
          color: theme.colors.gray[6],
          tr: {
            td: {
              padding: `${theme.spacing.md} !important`,
              fontSize: theme.fontSizes.sm,
              position: 'relative',
              textWrap: 'balance',
            },
          },
        },
      })}
      highlightOnHover
      minHeight={'350px'}
      withBorder={true}
      borderRadius="sm"
      verticalAlignment="top"
      sortStatus={sortStatus}
      onSortStatusChange={onSortStatusChangeHandler}
      columns={columns}
      idAccessor={idAccessor}
      records={records}
      totalRecords={totalRecords}
      fetching={fetching}
    />
  )
}

export default Table
