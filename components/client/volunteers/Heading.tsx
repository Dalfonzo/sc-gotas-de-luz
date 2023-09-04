import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import HeadingWithDecoration from '../common/heading-with-decoration/HeadingWithDecoration'

const Heading = ({ onScroll }: { onScroll: () => void }) => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <HeadingWithDecoration
        title={
          <Text as="h1" variant="title" textAlign="center">
            Forma parte de <br /> nuestro equipo
          </Text>
        }
      />

      <Text variant="normal" px="2rem">
        Gotas de luz es una organización sin fines de lucro que depende de los voluntarios para llevar a cabo nuestra
        misión de mejorar la calidad de vida de la población, instituciones y centros de cuidados menos favorecidos. Si
        estás interesado en{' '}
        <Text as="span" color="aqua.light" cursor="pointer" textDecoration="underline" onClick={onScroll}>
          participar
        </Text>
        , te mostramos algunas razones por la que deberías considerar registrarte como voluntario:
      </Text>
    </Box>
  )
}

export default Heading
