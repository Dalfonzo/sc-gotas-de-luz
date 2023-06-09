import { ActionIcon, Tooltip } from '@mantine/core'
import { IconTool, IconWorld } from '@tabler/icons-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

export const ContextButton = () => {
  const { status } = useSession()
  const router = useRouter()

  const isAuthenticated = () => status === 'authenticated'
  const isAdminContext = () => router.pathname.startsWith('/admin')

  const handleClick = () => {
    if (isAdminContext()) {
      router.replace('/')
      return
    }
    router.replace('/admin/dashboard')
  }

  if (isAuthenticated())
    return (
      <Tooltip withArrow label={isAdminContext() ? 'Ir a público' : 'Ir a administrador'}>
        <ActionIcon
          color="cyan"
          variant="gradient"
          size="xl"
          radius="xl"
          onClick={handleClick}
          sx={() => ({ position: 'fixed', right: '2em', bottom: '2em' })}
        >
          {isAdminContext() ? <IconWorld size={24} /> : <IconTool size={24} />}
        </ActionIcon>
      </Tooltip>
    )
  return <></>
}
