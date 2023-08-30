import { Indicator, Tabs } from '@mantine/core'
import { IconCash, IconHeartHandshake } from '@tabler/icons-react'
import useSWR from 'swr'
import { useFetcher } from '~/hooks/fetcher'
import { useTabs } from '~/hooks/useTabs'
import { SWR_KEYS } from '~/utils/constants'
import DonationMain from './Main'
import DonationMethodTable from './methods/Table'

const VALUES = {
  DONATION: 'donation',
  METHOD: 'method',
}
export function DonationTabs() {
  const { fetcher } = useFetcher<{ pending: number }>()

  const { data: donationData } = useSWR<{ pending: number }>(SWR_KEYS.PENDING_DONATIONS, fetcher)
  const { currentTab, onTabChange } = useTabs(VALUES.DONATION)
  return (
    <Tabs keepMounted={false} value={currentTab} onTabChange={onTabChange}>
      <Tabs.List>
        <Indicator label={donationData?.pending} disabled={!donationData?.pending} offset={5} size={18}>
          <Tabs.Tab value={VALUES.DONATION} icon={<IconHeartHandshake size="0.8rem" />}>
            Gestionar donaciones
          </Tabs.Tab>
        </Indicator>

        <Tabs.Tab value={VALUES.METHOD} icon={<IconCash size="0.8rem" />}>
          Gestionar métodos de pago
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value={VALUES.DONATION} pt="xl">
        <DonationMain pending={donationData?.pending} />
      </Tabs.Panel>

      <Tabs.Panel value={VALUES.METHOD} pt="xl">
        <DonationMethodTable />
      </Tabs.Panel>
    </Tabs>
  )
}
