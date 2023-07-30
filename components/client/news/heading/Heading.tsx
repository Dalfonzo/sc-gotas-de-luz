import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Heading = () => {
  return (
    <Box maxW="1080px" mx="auto" my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h1" variant="title" marginBottom="4rem" textAlign="center">
        Novedades
      </Text>
      <Text variant="normal" px="2rem">
        ¡Bienvenido a la sección de noticias! Acá compartimos historias, reflexiones y actualizaciones sobre nuestros
        esfuerzos y el impacto que estamos causando en nuestra comunidad. Redactados desde el corazón, esperamos que
        estos artículos eduquen, informen e inspiren a involucrarse para marcar la diferencia ❤️
      </Text>
    </Box>
  )
}

export default Heading
