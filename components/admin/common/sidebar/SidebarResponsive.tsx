import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Icon,
  Link,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { RoutesI } from '~/common/types'
import Separator from '~/components/admin/common/separator'

export default function SidebarResponsive({ routes }: { routes: RoutesI[] }) {
  const router = useRouter()
  const activeBg = useColorModeValue('white', 'gray.700')
  const inactiveBg = useColorModeValue('white', 'gray.700')
  const activeColor = useColorModeValue('gray.700', 'white')
  const inactiveColor = useColorModeValue('gray.400', 'gray.400')
  const hamburgerColor = useColorModeValue('gray.500', 'gray.200')
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Flex display={{ sm: 'flex', xl: 'none' }} alignItems="center">
      <HamburgerIcon color={hamburgerColor} w="18px" h="18px" onClick={onOpen} />
      <Drawer isOpen={isOpen} onClose={onClose} placement={'left'}>
        <DrawerOverlay />
        <DrawerContent
          w="250px"
          maxW="250px"
          ms={{
            sm: '16px',
          }}
          my={{
            sm: '16px',
          }}
          borderRadius="16px"
        >
          <DrawerCloseButton _focus={{ boxShadow: 'none' }} _hover={{ boxShadow: 'none' }} />
          <DrawerBody maxW="250px" px="1rem">
            <Box maxW="100%" h="100vh">
              <Box pt="1rem" mb="8px">
                <Box display="flex" mb="1rem" justifyContent="center" alignItems="center">
                  <Image src="/assets/svg/gotas_de_luz.svg" alt="Gotas de Luz" width={64} height={64} />
                </Box>
                <Separator />
              </Box>
              <Stack direction="column" mb="40px">
                <Box>
                  {routes.map((link, key) => (
                    <Link key={key} href={link.path}>
                      <Box
                        boxSize="initial"
                        justifyContent="flex-start"
                        alignItems="center"
                        fontWeight="bold"
                        bg={router.pathname === link.path ? activeBg : 'transparent'}
                        mb={{
                          xl: '12px',
                        }}
                        mx={{
                          xl: 'auto',
                        }}
                        py="12px"
                        ps={{
                          sm: '10px',
                          xl: '16px',
                        }}
                        borderRadius="15px"
                        _hover={{
                          cursor: 'pointer',
                        }}
                        w="100%"
                        _active={{
                          bg: 'inherit',
                          transform: 'none',
                          borderColor: 'transparent',
                        }}
                        _focus={{
                          boxShadow: 'none',
                        }}
                      >
                        <Flex>
                          <Icon
                            as={link.icon}
                            bg={router.pathname === link.path ? 'teal.300' : inactiveBg}
                            color={router.pathname === link.path ? 'white' : 'teal.300'}
                            h="1.5rem"
                            w="1.5rem"
                            me="12px"
                            padding=".2rem"
                            borderRadius="5px"
                          />
                          <Text
                            color={router.pathname === link.path ? activeColor : inactiveColor}
                            my="auto"
                            fontSize="sm"
                          >
                            {link.name}
                          </Text>
                        </Flex>
                      </Box>
                    </Link>
                  ))}
                </Box>
              </Stack>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}
