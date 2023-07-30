import { Indicator, Tabs } from '@mantine/core'
import { IconUserHeart, IconUserQuestion } from '@tabler/icons-react'
import useSWR from 'swr'
import { useFetcher } from '~/hooks/fetcher'
import { SWR_KEYS } from '~/utils/constants'
import VolunteersTable from './Volunteers'
export default function VolunteersMain() {
  const { fetcher } = useFetcher<{ pending: number }>()
  const { data: volunteerData } = useSWR<{ pending: number }>(SWR_KEYS.PENDING_VOLUNTEERS, fetcher)
  return (
    <Tabs defaultValue="manage">
      <Tabs.List>
        <Tabs.Tab value="manage" icon={<IconUserHeart size="0.8rem" />}>
          Voluntarios
        </Tabs.Tab>
        <Indicator disabled={!volunteerData?.pending} size={16} offset={5} label={volunteerData?.pending}>
          <Tabs.Tab value="requests" icon={<IconUserQuestion size="0.8rem" />}>
            Solicitudes
          </Tabs.Tab>
        </Indicator>
      </Tabs.List>

      <Tabs.Panel value="manage" pt="xs">
        <VolunteersTable showActives={true} />
      </Tabs.Panel>

      <Tabs.Panel value="requests" pt="xl">
        <VolunteersTable showActives={false} />
      </Tabs.Panel>
    </Tabs>
  )
}
