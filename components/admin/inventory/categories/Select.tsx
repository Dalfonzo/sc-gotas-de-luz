import { SelectProps } from '@mantine/core'
import { Category } from '@prisma/client'
import { Dispatch, SetStateAction } from 'react'
import useSWR from 'swr'
import { CustomSelect } from '~/components/common/custom-select/CustomSelect'
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
    <CustomSelect
      {...rest}
  
      selected={selectedCategory}
      setSelected={setSelectedCategory}
      error={catError && 'Error al cargar categorías'}
      data={categories?.map((cat) => ({ label: cat.name, value: String(cat.id) })) || []}
    />
  )
}
