import { ActionIcon, Button, Flex, Modal, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { modals } from '@mantine/modals'
import { News } from '@prisma/client'
import { IconEdit, IconEye, IconPlus, IconTrash } from '@tabler/icons-react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import { NewsArticle } from '~/components/client/news/article/Article'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { useFetcher, usePaginationFetcherParams, usePaginationFetcherResponse } from '~/hooks/fetcher'
import useAccessGuard from '~/hooks/useAccessGuard'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { RESOURCES } from '~/utils/constants'
import Table from '../common/table/Table'

type FetcherResponse = usePaginationFetcherResponse<(News & { img: any })[]>
const PER_PAGE = 10

export default function NewsMain() {
  const router = useRouter()
  const { fetcher } = useFetcher<(News & { img: any })[]>()
  const {
    data: news,
    error,
    mutate,
    isLoading,
  } = useSWR<FetcherResponse>(
    [`/api/admin/news`, { dates: 'date', usePagination: true, query: { page: router.query.page, size: PER_PAGE } }],
    ([url, dto]: usePaginationFetcherParams<News[]>) => fetcher(url, dto)
  )
  const { canUpdate, canDelete } = useAccessGuard({ resource: RESOURCES.NEWS })
  const [selected, setSelected] = useState<News | null>(null)
  const fetcherInstance = useFetcherInstance()
  const [isOpen, { toggle }] = useDisclosure(false)
  // TODO: see if it's worth it to simplify confirm + callback
  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<number>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/news/${id}`)
      await mutate()
      return true
    },
    success: { message: 'Noticia eliminada' },
  })

  const openDeleteModal = (item: News) =>
    modals.openConfirmModal({
      title: '¿Borrar artículo?',
      centered: true,
      children: (
        <Text size="sm">
          Este artículo -titulado <i>{item.title}</i>- no podrá ser recuperado.
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => await onDelete(item.id),
    })
  return (
    <>
      <Link href="/admin/news/add">
        <Button leftIcon={<IconPlus />} color="green" ml="auto" display="block" my="lg">
          Agregar
        </Button>
      </Link>
      <Modal size="xl" opened={isOpen} onClose={toggle} title="Vista de artículo">
        {selected && <NewsArticle news={selected} />}
      </Modal>
      <Table
        fetching={isLoading}
        idAccessor="id"
        records={news?.records}
        totalRecords={news?.total}
        recordsPerPage={PER_PAGE}
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
            accessor: 'content',
            title: 'Cuerpo',
            width: 250,
            ellipsis: true,
            sortable: true,
            render: ({ content }) => (
              <Text
                lineClamp={3}
                dangerouslySetInnerHTML={{
                  __html: content,
                }}
              />
            ),
          },
          {
            accessor: 'date',
            title: 'Publicado',
            width: 100,
            ellipsis: true,
            sortable: true,
            render: ({ date }) => <Text>hace {formatDistanceToNow(date, { locale: es })}</Text>,
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
                  <Link href={`/admin/news/edit/${item.id}`}>
                    <ActionIcon variant="light" color="orange">
                      <IconEdit size="1rem" />
                    </ActionIcon>
                  </Link>
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
    </>
  )
}
