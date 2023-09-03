import { Box, Text } from '@chakra-ui/react'
import withAnimation from '~/hoc/withAnimation'
import { responsiveProperty } from '~/theme/utils'
import HeadingWithDecoration from '../../common/heading-with-decoration/HeadingWithDecoration'

const Heading = () => {
  return (
    <Box maxW="1080px" mx="auto" my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <HeadingWithDecoration title="Novedades" />
      <Text variant="normal" px="2rem">
        ¡Bienvenido a la sección de noticias! Acá compartimos historias, reflexiones y actualizaciones sobre nuestros
        esfuerzos y el impacto que estamos causando en nuestra comunidad. Redactados desde el corazón, esperamos que
        estos artículos eduquen, informen e inspiren a involucrarse para marcar la diferencia ❤️
      </Text>
    </Box>
  )
}

export default withAnimation(Heading)
