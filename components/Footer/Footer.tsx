import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function Footer() {
  return (
    <Flex
      flexDirection={{
        base: 'column',
        xl: 'row',
      }}
      alignItems="center"
      justifyContent="center"
      px="30px"
      pb="20px"
    >
      <Text color="gray.400" textAlign="center" mb={{ base: '20px', xl: '0px' }}>
        &copy; 2022
      </Text>
    </Flex>
  )
}
