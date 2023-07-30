import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Heading = ({ onScroll }: { onScroll: () => void }) => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h2" variant="title" marginBottom="4rem" textAlign="center">
        Forma parte de <br /> nuestro equipo
      </Text>
      <Text variant="normal" px="2rem">
        Gotas de luz es una organización sin fines de lucro que depende de los voluntarios para llevar a cabo nuestra
        misión de mejorar la calidad de vida de la población, instituciones y centros de cuidados menos favorecidos. Si
        estás interesado en{' '}
        <Text as="span" color="teal.500" cursor="pointer" textDecoration="underline" onClick={onScroll}>
          participar
        </Text>
        , te mostramos algunas razones por la que deberías considerar registrarte como voluntario:
      </Text>
    </Box>
  )
}

export default Heading
