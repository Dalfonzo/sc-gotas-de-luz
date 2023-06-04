import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Link,
  useColorModeValue,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import React from 'react'
import AdminNavbarLinks from './AdminNavbarLinks'

interface AdminNavbarI {
  brandText: string
  logoText: string
}

export default function AdminNavbar(props: AdminNavbarI & Pick<UseDisclosureReturn, 'onOpen'>) {
  const { brandText } = props

  // Here are all the props that may change depending on navbar's type or state.(secondary, variant, scrolled)
  let mainText = useColorModeValue('gray.700', 'gray.200')
  let secondaryText = useColorModeValue('gray.400', 'gray.200')
  let navbarFilter = 'none'
  let navbarBackdrop = 'blur(21px)'
  let navbarShadow = 'none'
  let navbarBg = 'none'
  let navbarBorder = 'transparent'
  let secondaryMargin = '0px'
  let paddingX = '15px'

  return (
    <Flex
      position="absolute"
      boxShadow={navbarShadow}
      bg={navbarBg}
      borderColor={navbarBorder}
      filter={navbarFilter}
      backdropFilter={navbarBackdrop}
      borderWidth="1.5px"
      borderStyle="solid"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      transitionTimingFunction="linear, linear, linear, linear"
      borderRadius="16px"
      display="flex"
      minH="75px"
      justifyContent={{ xl: 'center' }}
      lineHeight="25.6px"
      mx="auto"
      mt={secondaryMargin}
      pb="8px"
      right={{ base: '0' }}
      px={{
        sm: paddingX,
        md: '30px',
      }}
      ps={{
        xl: '12px',
      }}
      pt="8px"
      top="18px"
      w={{ base: 'calc(100vw - 30px)', xl: 'calc(100vw - 75px - 275px)' }}
      alignItems="center"
    >
      <Flex
        w="100%"
        flexDirection={{
          md: 'row',
        }}
        alignItems="center"
      >
        <Box mb={{ sm: '8px', md: '0px' }} w="100%">
          <Breadcrumb>
            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="#" color={secondaryText}>
                Páginas
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color={mainText}>
              <BreadcrumbLink href="#" color={mainText}>
                {brandText}
              </BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          {/* Here we create navbar brand, based on route name */}
          <Link
            color={mainText}
            href="#"
            bg="inherit"
            borderRadius="inherit"
            fontWeight="bold"
            _hover={{ color: { mainText } }}
            _active={{
              bg: 'inherit',
              transform: 'none',
              borderColor: 'transparent',
            }}
            _focus={{
              boxShadow: 'none',
            }}
          >
            {brandText}
          </Link>
        </Box>
        <Box ms="auto">
          <AdminNavbarLinks onOpen={props.onOpen} logoText={props.logoText} />
        </Box>
      </Flex>
    </Flex>
  )
}
