import { Box, Flex, Icon, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import { Separator } from 'components/Separator/Separator'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { RoutesI } from 'shared/types'

const SidebarContent = ({ routes }: { routes: RoutesI[] }) => {
  const router = useRouter()

  const activeBg = useColorModeValue('white', 'gray.700')
  const inactiveBg = useColorModeValue('white', 'gray.700')
  const activeColor = useColorModeValue('gray.700', 'white')
  const inactiveColor = useColorModeValue('gray.400', 'gray.400')

  return (
    <>
      <Box pt="1rem" mb="12px">
        <Box display="flex" margin="1rem" justifyContent="center" alignItems="center">
          <Image src="/assets/svg/gotas_de_luz.svg" alt="Gotas de Luz" width={72} height={72} />
        </Box>
        <Separator></Separator>
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
                  <Text color={router.pathname === link.path ? activeColor : inactiveColor} my="auto" fontSize="sm">
                    {link.name}
                  </Text>
                </Flex>
              </Box>
            </Link>
          ))}
        </Box>
      </Stack>
    </>
  )
}

export default SidebarContent
