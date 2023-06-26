import { Tabs } from '@mantine/core'
import { IconUserHeart, IconUserQuestion } from '@tabler/icons-react'
import VolunteersTable from './Volunteers'

export default function VolunteersMain() {
  return (
    <Tabs defaultValue="manage">
      <Tabs.List>
        <Tabs.Tab value="manage" icon={<IconUserHeart size="0.8rem" />}>
          Voluntarios
        </Tabs.Tab>
        <Tabs.Tab value="requests" icon={<IconUserQuestion size="0.8rem" />}>
          Solicitudes
        </Tabs.Tab>
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
