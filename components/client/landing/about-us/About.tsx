import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import ImageCard from './ImageCard'

const AboutUs = () => {
  return (
    <Box
      maxW="7xl"
      mx="auto"
      my={responsiveProperty({ mobileSize: 3, desktopSize: 10, unit: 'rem' })}
      alignItems="center"
      padding="0 1rem"
    >
      <Text variant="title" textAlign="center" margin="auto" color="aqua.light">
        Lo que hacemos
      </Text>
      <Text
        variant="normal"
        width={{ base: '80%', sm: '70%', md: '60%' }}
        margin={{ base: '2rem auto', sm: '3rem auto', md: '4rem auto' }}
        textAlign="center"
      >
        Conservando nuestra esencia, realizamos diferentes actividades con el objetivo de dar a las personas algo más
        que un aporte material. Queremos darle una gota de luz en medio de este mar de oscuridad.
      </Text>
      <Box marginY="8rem">
        <ImageCard imgAlt="equipo de gotas de luz" imgSrc="/assets/img/crew-img.png" />
        <ImageCard imgAlt="Niña sonriendo" imgSrc="/assets/img/girl-smiling.png" />
        <ImageCard imgAlt="Niños posando para una tomarse una fotografía" imgSrc="/assets/img/event-activities.jpg" />
      </Box>
    </Box>
  )
}

export default AboutUs
