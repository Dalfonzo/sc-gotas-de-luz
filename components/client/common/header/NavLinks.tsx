import { Box, BoxProps, Flex } from '@chakra-ui/react'
import Link from 'next/link'

const NavLinks = (props: BoxProps) => {
  return (
    <Box as="nav" {...props}>
      <Flex
        as="ul"
        listStyleType="none"
        fontSize="18px"
        gap="30px"
        fontWeight="bold"
        color="text.light"
        flexDir={{ base: 'column', lg: 'row' }}
        alignItems={{ base: 'center', lg: 'unset' }}
      >
        <li>
          <Link href="/">Inicio</Link>
        </li>
        <li>
          <Link href="/about">Acerca</Link>
        </li>
        <li>
          <Link href="/volunteers">Voluntariado</Link>
        </li>
        <li>
          <Link href="/events">Eventos</Link>
        </li>
        <Box as="li" color="aqua.light">
          <Link href="/donate">Donaciones</Link>
        </Box>
      </Flex>
    </Box>
  )
}

export default NavLinks
