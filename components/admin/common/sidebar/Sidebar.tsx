import { Box, useColorModeValue } from '@chakra-ui/react'
import React from 'react'
import routes from '~/common/routes'
import SidebarContent from './SidebarContent'

function Sidebar() {
  const sidebarBg = useColorModeValue('white', 'gray.700')

  return (
    <Box>
      <Box display={{ base: 'none', xl: 'block' }} position="fixed">
        <Box
          bg={sidebarBg}
          transition="0.2s linear"
          w="260px"
          maxW="260px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          h="calc(100vh - 32px)"
          ps="20px"
          pe="20px"
          m="16px 0px 16px 16px"
          borderRadius="16px"
        >
          <SidebarContent routes={routes} />
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
