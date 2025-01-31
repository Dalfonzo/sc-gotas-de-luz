import { Flex, UseDisclosureReturn } from '@chakra-ui/react'
import routes from '~/common/routes'
import SidebarResponsive from '~/components/admin/common/sidebar/SidebarResponsive'

interface AdminNavBarLinksI {
  logoText: string
}

export default function AdminNavBarLinks(props: AdminNavBarLinksI & Pick<UseDisclosureReturn, 'onOpen'>) {
  const { ...rest } = props

  return (
    <Flex pe={{ sm: '0px', md: '16px' }} w={{ sm: '100%', md: 'auto' }} alignItems="center" flexDirection="row">
      <SidebarResponsive routes={routes} {...rest} />
    </Flex>
  )
}
