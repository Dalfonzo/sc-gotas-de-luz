import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Heading = () => {
  return (
    <Box maxW="1080px" mx="auto" my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h1" variant="title" marginBottom="4rem" textAlign="center">
        Eventos
      </Text>
      <Text variant="normal" px="2rem">
        Entérate de nuestras próximas jornadas, recolecciones, visitas a comunidades... ¡todo por una gran causa! No
        dudes en hacer click en los eventos del calendario para conocer más detalles. ¡Participa y marca la diferencia!
      </Text>
    </Box>
  )
}

export default Heading
