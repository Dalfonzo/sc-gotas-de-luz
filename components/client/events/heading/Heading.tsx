import { Box, Text } from '@chakra-ui/react'
import withAnimation from '~/hoc/withAnimation'
import { responsiveProperty } from '~/theme/utils'
import HeadingWithDecoration from '../../common/heading-with-decoration/HeadingWithDecoration'

const Heading = () => {
  return (
    <Box maxW="1080px" mx="auto" my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <HeadingWithDecoration title="Eventos" />
      <Text variant="normal" px="2rem">
        Entérate de nuestras próximas jornadas, recolecciones, visitas a comunidades... ¡todo por una gran causa! No
        dudes en hacer click en los eventos del calendario para conocer más detalles. ¡Participa y marca la diferencia!
      </Text>
    </Box>
  )
}

export default withAnimation(Heading)
