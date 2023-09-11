import { Group, NumberInput, Text, TextInput, Textarea } from '@mantine/core'
import { modals } from '@mantine/modals'
import { RefObject, useRef } from 'react'
import { useSWRConfig } from 'swr'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { IncludeDonation } from '~/prisma/types'
import { SWR_KEYS } from '~/utils/constants'

interface Props {
  afterDelete?: () => Promise<any>
  afterUpdate?: () => Promise<any>
}
const AMOUNT_INPUT_ID = '_amount'

interface DetailProps {
  item: IncludeDonation
  amountRef?: RefObject<HTMLInputElement>
}

const DonationDetails = ({ item, amountRef }: DetailProps) => {
  return (
    <Group position="apart" align="end" spacing="sm" my="md">
      <TextInput description="No modificable" label="Nombre" value={item.name || 'Anónimo'} readOnly />

      <NumberInput
        label="Monto"
        description="En dólares (modificable)"
        defaultValue={item.amount}
        min={1}
        id={AMOUNT_INPUT_ID}
        ref={amountRef}
        precision={2}
        readOnly={item.isVerified || !amountRef}
      />
      <Textarea
        description="No modificable"
        w="100%"
        label="Referencia"
        value={`${item.reference} (${item.method.name})`}
        readOnly
      />
    </Group>
  )
}

export const useDonationActions = ({ afterDelete, afterUpdate }: Props) => {
  const fetcherInstance = useFetcherInstance()
  const { mutate } = useSWRConfig()
  const amountRef = useRef<HTMLInputElement>(null)
  const { onSubmit: onUpdate, loadingSubmit: loadingUpdate } = useSubmitHandler<{ id: string; isVerified: boolean }>({
    callback: async ({ id, isVerified }) => {
      await fetcherInstance.put(`/api/admin/donation/${id}`, {
        isVerified,
        ...(isVerified && { amount: Number(amountRef.current?.value) }),
      })
      await mutate(SWR_KEYS.PENDING_DONATIONS)
      afterUpdate && (await afterUpdate())
      return true
    },
    success: { message: 'Donativo modificado' },
  })

  const openUpdateModal = (item: IncludeDonation) =>
    modals.openConfirmModal(
      item.isVerified
        ? {
            title: <b>¿Anular verificación de donativo? </b>,
            centered: true,
            children: (
              <Text size="sm">
                Si el donativo fue aprobado por equivocación, puedes quitar su verificación y después eliminarlo, si es
                necesario.
                <DonationDetails item={item} />
              </Text>
            ),
            labels: { confirm: 'Anular', cancel: 'Cancelar' },
            confirmProps: { color: 'orange', loading: loadingUpdate },
            onConfirm: async () => await onUpdate({ id: item.id, isVerified: false }),
          }
        : {
            title: <b>¿Aprobar donativo? </b>,
            centered: true,
            children: (
              <Text size="sm">
                Asegúrate de haber verificado la transacción del donativo para aprobarlo.
                <DonationDetails item={item} amountRef={amountRef} />
              </Text>
            ),
            labels: { confirm: 'Aprobar', cancel: 'Cancelar' },
            confirmProps: { color: 'green', loading: loadingUpdate },
            onConfirm: async () => await onUpdate({ id: item.id, isVerified: true }),
          }
    )

  const { onSubmit: onDelete, loadingSubmit: loadingDelete } = useSubmitHandler<string>({
    callback: async (id) => {
      await fetcherInstance.delete(`/api/admin/donation/${id}`)
      afterDelete && (await afterDelete())
      return true
    },
    success: { message: 'Donativo eliminado' },
  })

  const openDeleteModal = (item: IncludeDonation) =>
    modals.openConfirmModal({
      title: <b>¿Borrar donativo? </b>,
      centered: true,
      children: (
        <Text size="sm">
          Solo elimina en caso de que el donativo haya sido fraudulento, ya que no podrá ser recuperado una vez
          eliminado.
          <DonationDetails item={item} />
        </Text>
      ),
      labels: { confirm: 'Borrar', cancel: 'Cancelar' },
      confirmProps: { color: 'red', loading: loadingDelete },
      onConfirm: async () => await onDelete(item.id),
    })
  return {
    onDelete: openDeleteModal,
    onApprove: openUpdateModal,
  }
}
