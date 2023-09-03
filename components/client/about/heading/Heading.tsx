import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import HeadingWithDecoration from '../../common/heading-with-decoration/HeadingWithDecoration'

const Heading = () => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <HeadingWithDecoration title="Acerca de nosotros" />
      <Text variant="normal" px="2rem">
        Somos un grupo de jóvenes dispuestos a asistir a la población mas vulnerable para mejorar la calidad de vida de
        los menos favorecidos, basados en valores como el compañerismo, el servicio, la integridad, la empatía y el
        valor humano.
      </Text>
    </Box>
  )
}

export default Heading
