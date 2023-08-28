import { Stack } from '@mantine/core'
import { DonationMethod } from '@prisma/client'
import useSWR from 'swr'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import { MethodCard } from './MethodCard'
type FetchResult = DonationMethod[]

interface Props {
  onSelect: (id: number) => void
  selected: number | null
}

export const MethodSelect = ({ onSelect, selected }: Props) => {
  const { fetcher } = useFetcher<FetchResult>()
  const {
    data: methods,
    error,
    isLoading,
  } = useSWR<FetchResult>(
    [
      `/api/donation/method`,
      {
        usePagination: false,
      },
    ],
    ([url, dto]: useFetcherParams<FetchResult>) => fetcher(url, dto)
  )

  return (
    <UiFeedback
      isLoading={isLoading}
      emptyMsg={[
        'Lo sentimos, no disponemos de métodos para recibir donaciones',
        'Intentaremos actualizar esta información lo más pronto posible',
      ]}
      isError={error}
      errorMsg={[
        'Lo sentimos, ha ocurrido un error al cargar las formas de donar',
        'Intenta cargar la página nuevamente',
      ]}
      loadingType="skeleton"
      loadingItems={3}
    >
      <Stack>
        {methods?.map((met) => (
          <MethodCard
            isSelected={selected === met.id}
            key={met.id}
            onClick={() => {
              onSelect(met.id)
            }}
            name={met.name}
            reference={met.reference}
          />
        ))}
      </Stack>
    </UiFeedback>
  )
}
