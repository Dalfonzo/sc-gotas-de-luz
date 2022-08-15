import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Heading = () => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h1" variant="title" marginBottom="4rem" textAlign="center">
        Acerca de nosotros
      </Text>
      <Text variant="normal" px="2rem">
        Somos un grupo de jóvenes dispuestos a asistir a la población mas vulnerable para mejorar la calidad de vida de
        los menos favorecidos, basados en valores como el compañerismo, el servicio, la integridad, la empatía y el
        valor humano.
      </Text>
    </Box>
  )
}

export default Heading
