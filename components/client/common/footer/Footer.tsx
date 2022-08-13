import { Box, Flex, Image, List, ListItem, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Footer = () => {
  return (
    <Box as="footer" color="white" marginTop="8rem">
      <Image src="assets/svg/footer-bg.svg" alt="footer background" width="100%" />
      <Box padding="5rem 2rem" background="aqua.light" marginTop="-9vw">
        <Flex
          maxW="7xl"
          margin="auto"
          fontSize={responsiveProperty({ mobileSize: 12, desktopSize: 18 })}
          justifyContent="space-between"
          flexDir={{ base: 'column', md: 'row' }}
          alignItems={{ base: 'center', md: 'unset' }}
          gap="2rem"
        >
          <Box
            display="flex"
            alignItems="center"
            flexDir={{ base: 'column', sm: 'row' }}
            gap={{ base: '1.5rem', sm: 'unset' }}
          >
            <Image src="assets/svg/logo-footer.svg" alt="gotas de luz" />
            <Box marginLeft="2rem" width="80%">
              <Text fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 25 })} fontWeight="bold">
                Cambiemos al mundo, juntos.
              </Text>
              <Text>Existen muchas formas en que puedes colaborar con nosotros. </Text>
            </Box>
          </Box>
          <Flex gap={responsiveProperty({ mobileSize: 2, desktopSize: 5, unit: 'rem' })}>
            <List spacing="0.5rem">
              <ListItem
                as="li"
                fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 25 })}
                fontWeight="bold"
                marginBottom="1rem"
              >
                Sitio
              </ListItem>
              <ListItem>Acerca</ListItem>
              <ListItem>Dona</ListItem>
              <ListItem>Voluntariado</ListItem>
              <ListItem>Eventos</ListItem>
            </List>
            <List spacing="0.5rem">
              <Box
                as="li"
                fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 25 })}
                fontWeight="bold"
                marginBottom="1rem"
              >
                Contacto
              </Box>
              <ListItem>@gotasdeluz.ve</ListItem>
              <ListItem>(0414)-123456</ListItem>
              <ListItem>(0212)-71225215</ListItem>
            </List>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}

export default Footer
