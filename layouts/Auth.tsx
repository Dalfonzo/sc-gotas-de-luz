import { Box } from '@chakra-ui/react'
import Footer from '~/components/admin/footer/Footer'
import React from 'react'

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <Box w="100%">
      <Box w="100%">{children}</Box>
      <Box px="24px" mx="auto" width="1044px" maxW="100%">
        <Footer />
      </Box>
    </Box>
  )
}
