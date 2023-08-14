import { Inventory } from '@prisma/client'
import { GetServerSideProps } from 'next'
import InventoryRecordMain from '~/components/admin/inventory/records/Main'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { withProtectedRoute } from '~/hoc/withProtectedRoute'
import prisma from '~/lib/db/prisma'
import { OPERATION_METHODS, RESOURCES } from '~/utils/constants'

const InventoryRecordPage = ({ inventory, error }: Props) => {
  return (
    <UiFeedback isLoading={!inventory && !error} isError={error}>
      {' '}
      {inventory && <InventoryRecordMain inventory={inventory} />}
    </UiFeedback>
  )
}
export default withProtectedRoute(InventoryRecordPage, {
  operation: OPERATION_METHODS.READ,
  resource: RESOURCES.INVENTORY,
  title: 'inventario',
})
interface Props {
  inventory?: Inventory | null
  error?: any
}

export const getServerSideProps: GetServerSideProps<Props> = async (req) => {
  const id = String(req.params?.id)
  try {
    const current = await prisma.inventory.findFirst({ where: { id: id } })
    return {
      props: { inventory: current },
    }
  } catch (error) {
    return {
      props: { error: true },
    }
  }
}
