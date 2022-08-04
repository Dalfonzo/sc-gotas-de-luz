import { Box, Flex, Image } from '@chakra-ui/react'
import Link from 'next/link'

const Header = () => {
  return (
    <Box as="header">
      <Box maxW="7xl" margin="auto" display="flex" justifyContent="space-between" alignItems="center" padding="16px">
        <Image src="/assets/svg/logo-header.svg" alt="gotas de luz" />
        <Box as="nav">
          <Flex as="ul" listStyleType="none" fontSize="18px" gap="30px" fontWeight="bold" color="text.light">
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
          </Flex>
        </Box>
      </Box>
    </Box>
  )
}

export default Header
