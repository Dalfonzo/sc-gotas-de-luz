import { Button, Group, Modal, NumberInput, Text, TextInput, Textarea } from '@mantine/core'
import { modals } from '@mantine/modals'
import { RefObject, useRef } from 'react'
import { useSWRConfig } from 'swr'
import { Skeletons } from '~/components/common/feedback/UiFeedback'
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
  messageRef?: RefObject<HTMLTextAreaElement>
}

const DonationDetails = ({ item, amountRef, messageRef }: DetailProps) => {
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
      {messageRef && item.email && !item.emailSent && (
        <Textarea
          required
          label="Agradecimiento"
          w="100%"
          minRows={3}
          description="Para enviárselo por correo como agradecimiento"
          placeholder="Puedes explicar en qué se usará el donativo, o simplemente dar un sincero mensaje de gracias"
          ref={messageRef}
        />
      )}
    </Group>
  )
}

interface ConfirmDto {
  id: string
  isVerified: boolean
  amount?: number
  thanks?: string
}

interface ConfirmModalProps {
  confirm: boolean
  item?: IncludeDonation
  open: boolean
  toggle: () => void
  loading: boolean
  onSubmit: (dto: ConfirmDto) => Promise<void>
}

export const ConfirmModal = ({ confirm, item, open, toggle, loading, onSubmit }: ConfirmModalProps) => {
  const amountRef = useRef<HTMLInputElement>(null)
  const messageRef = useRef<HTMLTextAreaElement>(null)
  if (confirm) {
    return (
      <Modal opened={open} onClose={toggle} title="¿Aprobar donativo?" centered>
        {item ? (
          <>
            {' '}
            <Text size="sm">
              Asegúrate de haber verificado la transacción del donativo para aprobarlo.
              <DonationDetails item={item} amountRef={amountRef} messageRef={messageRef} />
            </Text>
            <Group position="right" mt="lg">
              <Button onClick={toggle} variant="default" size="sm">
                Cancelar{' '}
              </Button>
              <Button
                onClick={() =>
                  onSubmit({
                    id: item.id,
                    isVerified: true,
                    amount: Number(amountRef.current?.value),
                    thanks: messageRef.current?.value,
                  })
                }
                color="green"
                loading={loading}
              >
                Aprobar
              </Button>
            </Group>{' '}
          </>
        ) : (
          <Skeletons rows={2} />
        )}
      </Modal>
    )
  }
  return (
    <Modal opened={open} onClose={toggle} title="¿Anular verificación de donativo?" centered>
      {item ? (
        <>
          <Text size="sm">
            Si el donativo fue aprobado por equivocación, puedes quitar su verificación y después eliminarlo, si es
            necesario.
            <DonationDetails item={item} />
          </Text>
          <Group position="right" mt="lg">
            <Button onClick={toggle} variant="default" size="sm">
              Cancelar{' '}
            </Button>
            <Button
              onClick={() =>
                onSubmit({
                  id: item.id,
                  isVerified: false,
                })
              }
              color="orange"
              loading={loading}
            >
              Anular
            </Button>
          </Group>
        </>
      ) : (
        <Skeletons rows={3} />
      )}
    </Modal>
  )
}

export const DonationConfirmProvider = () => {}

export const useDonationActions = ({ afterDelete, afterUpdate }: Props) => {
  const fetcherInstance = useFetcherInstance()
  const { mutate } = useSWRConfig()

  const { onSubmit: onUpdate, loadingSubmit: loadingUpdate } = useSubmitHandler<ConfirmDto>({
    callback: async ({ id, isVerified, amount, thanks }) => {
      await fetcherInstance.put(`/api/admin/donation/${id}`, {
        isVerified,
        ...(isVerified && { amount: Number(amount), thanks: thanks?.trim() }),
      })
      await mutate(SWR_KEYS.PENDING_DONATIONS)
      afterUpdate && (await afterUpdate())
      return true
    },
    success: { message: 'Donativo modificado' },
  })

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
    onUpdate,
    loadingUpdate,
  }
}
