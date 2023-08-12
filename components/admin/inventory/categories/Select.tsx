import { ActionIcon, Select, SelectProps } from '@mantine/core'
import { Category } from '@prisma/client'
import { IconX } from '@tabler/icons-react'
import { Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'

interface Props extends Omit<SelectProps, 'value' | 'data'> {
  selectedCategory: string | null
  setSelectedCategory: Dispatch<SetStateAction<string | null>> | ((e: any) => any)
}
export const CategoriesSelect = ({ selectedCategory, setSelectedCategory, ...rest }: Props) => {
  const { fetcher } = useFetcher<Category[]>()
  const {
    data: categories,
    error: catError,
    isLoading: loadingCats,
  } = useSWR<Category[]>(
    [
      `/api/admin/inventory/category`,
      {
        usePagination: false,
      },
    ],
    ([url, dto]: useFetcherParams<Category[]>) => fetcher(url, dto)
  )
  return (
    <Select
      {...rest}
      value={selectedCategory}
      onChange={(value) => setSelectedCategory(value)}
      error={catError && 'Error al cargar categorías'}
      rightSection={
        selectedCategory ? (
          <ActionIcon onClick={() => setSelectedCategory(null)}>
            <IconX size="1rem" />
          </ActionIcon>
        ) : undefined
      }
      data={categories?.map((cat) => ({ label: cat.name, value: String(cat.id) })) || []}
    />
  )
}
