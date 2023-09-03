import { Box, Flex, Image, List, ListItem, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { responsiveProperty } from '~/theme/utils'
import { SocialMedia } from '../social-media/SocialMedia'

const Footer = () => {
  return (
    <Box as="footer" color="dark" marginTop="8rem" background="#f2f2f2">
      <Box padding="5rem 2rem">
        <Box
          maxW="5xl"
          margin="2rem auto 4rem"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir={'column'}
          gap={{ base: '1.5rem', sm: 'unset' }}
        >
          <Image src="/assets/svg/logo-footer-black.svg" alt="gotas de luz" width={100} />
          <Text variant="subtitle-no-decoration" mt="2rem" textAlign={'center'} mb="1rem">
            Cambiemos al mundo, juntos
          </Text>
          <div>
            <Text textAlign={'center'}>Existen muchas formas en que puedes</Text>
            <Text textAlign={'center'}> colaborar con nosotros. </Text>
          </div>
        </Box>
        <Flex
          maxW="5xl"
          gap={responsiveProperty({ mobileSize: 2, desktopSize: 5, unit: 'rem' })}
          margin="auto"
          justifyContent={'space-evenly'}
          flexDir={{ base: 'column', sm: 'row' }}
        >
          <List spacing="0.5rem" textAlign={{ base: 'center', sm: 'unset' }}>
            <ListItem as="li">
              <Text variant="normal" fontWeight="bold" marginY="0.5em">
                Sitio
              </Text>
            </ListItem>
            <ListItem>
              <Link href="about">Acerca</Link>
            </ListItem>
            <ListItem>
              <Link href="donate">Dona</Link>
            </ListItem>
            <ListItem>
              <Link href="volunteers">Voluntariado</Link>
            </ListItem>
            <ListItem>
              <Link href="events">Eventos</Link>
            </ListItem>
            <ListItem>
              <Link href="news">Novedades</Link>
            </ListItem>
          </List>
          <List spacing="0.5rem" textAlign={{ base: 'center', sm: 'unset' }}>
            <Box as="li">
              <Text variant="normal" fontWeight="bold" marginY="0.5em">
                Contacto
              </Text>
            </Box>
            <ListItem>@gotasdeluz.ve</ListItem>
            <ListItem>(0414)-123456</ListItem>
            <ListItem>(0212)-71225215</ListItem>
            <ListItem>
              <SocialMedia />
            </ListItem>
          </List>
        </Flex>
      </Box>
    </Box>
  )
}

export default Footer
