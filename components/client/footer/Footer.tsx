import { Box, Flex, Image, List, ListItem, Text } from '@chakra-ui/react'

const Footer = () => {
  return (
    <Box as="footer" color="white">
      <Image src="assets/svg/footer-bg.svg" alt="footer background" width="100%" />
      <Box padding="5rem 0" background="aqua.light" marginTop="-9vw">
        <Flex maxW="7xl" margin="auto" fontSize="18px" justifyContent="space-between">
          <Box display="flex" alignItems="center">
            <Image src="assets/svg/logo-footer.svg" alt="gotas de luz" />
            <Box marginLeft="2rem" width="80%">
              <Text fontSize="25px" fontWeight="bold">
                Cambiemos al mundo, juntos.
              </Text>
              <Text>Existen muchas formas en que puedes colaborar con nosotros. </Text>
            </Box>
          </Box>
          <Flex gap="5rem">
            <List spacing="0.5rem">
              <ListItem as="li" fontSize="25px" fontWeight="bold" marginBottom="1rem">
                Sitio
              </ListItem>
              <ListItem>Acerca</ListItem>
              <ListItem>Dona</ListItem>
              <ListItem>Voluntariado</ListItem>
              <ListItem>Eventos</ListItem>
            </List>
            <List spacing="0.5rem">
              <Box as="li" fontSize="25px" fontWeight="bold" marginBottom="1rem">
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
