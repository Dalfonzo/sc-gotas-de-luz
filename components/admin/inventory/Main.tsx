import { Indicator, Tabs } from '@mantine/core'
import { IconAlertTriangle, IconBuildingWarehouse, IconCategory } from '@tabler/icons-react'
import useSWR from 'swr'
import { useFetcher } from '~/hooks/fetcher'
import { SWR_KEYS } from '~/utils/constants'
import CategoriesMain from './categories/Main'
const VALUES = {
  INVENTORY: 'inventory',
  CATEGORY: 'category',
  EXPIRING: 'expiring',
}
export default function InventoryMain() {
  const { fetcher } = useFetcher<{ pending: number }>()

  const { data: inventoryData } = useSWR<{ pending: number }>(SWR_KEYS.EXPIRING_INVENTORY, fetcher)

  return (
    <Tabs defaultValue={VALUES.INVENTORY}>
      <Tabs.List>
        <Tabs.Tab value={VALUES.INVENTORY} icon={<IconBuildingWarehouse size="0.8rem" />}>
          Gestionar inventario
        </Tabs.Tab>
        <Tabs.Tab value={VALUES.CATEGORY} icon={<IconCategory size="0.8rem" />}>
          Gestionar categorías
        </Tabs.Tab>
        <Indicator label={inventoryData?.pending} disabled={!inventoryData?.pending} offset={5} size={18}>
          <Tabs.Tab value={VALUES.EXPIRING} icon={<IconAlertTriangle size="0.8rem" />}>
            Inventario por expirar
          </Tabs.Tab>
        </Indicator>
      </Tabs.List>

      <Tabs.Panel value={VALUES.INVENTORY} pt="xl">
        <div>Hi</div>
      </Tabs.Panel>

      <Tabs.Panel value={VALUES.CATEGORY} pt="xl">
        <CategoriesMain />
      </Tabs.Panel>
      <Tabs.Panel value={VALUES.EXPIRING} pt="xl">
        <>Exp</>
      </Tabs.Panel>
    </Tabs>
  )
}
