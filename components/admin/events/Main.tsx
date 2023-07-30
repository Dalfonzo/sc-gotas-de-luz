import { Tabs } from '@mantine/core'
import { IconCalendar, IconSettings } from '@tabler/icons-react'
import MyCalendar from '~/components/client/events/calendar/Calendar'
import EventsManager from './Manager'
export default function EventsMain() {
  return (
    <Tabs defaultValue="manage">
      <Tabs.List>
        <Tabs.Tab value="manage" icon={<IconSettings size="0.8rem" />}>
          Gestionar eventos
        </Tabs.Tab>
        <Tabs.Tab value="calendar" icon={<IconCalendar size="0.8rem" />}>
          Ver calendario
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="manage" pt="xs">
        <EventsManager />
      </Tabs.Panel>

      <Tabs.Panel value="calendar" pt="xl">
        <MyCalendar />
      </Tabs.Panel>
    </Tabs>
  )
}
