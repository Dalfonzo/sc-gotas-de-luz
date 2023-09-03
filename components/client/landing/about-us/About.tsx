import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import Carousel, { ImageList } from './Carousel'

const firstRowList: ImageList[] = [
  { imgAlt: 'equipo de gotas de luz', imgSrc: '/assets/img/crew-img.png' },
  { imgAlt: 'Niña sonriendo', imgSrc: '/assets/img/girl-smiling.png' },
  { imgAlt: 'Niños posando para una tomarse una fotografía', imgSrc: '/assets/img/event-activities.jpg' },
]

const secondRowList: ImageList[] = [
  { imgAlt: 'equipo de gotas de luz', imgSrc: '/assets/img/crew-img.png' },
  { imgAlt: 'Niña sonriendo', imgSrc: '/assets/img/girl-smiling.png' },
  { imgAlt: 'Niños posando para una tomarse una fotografía', imgSrc: '/assets/img/event-activities.jpg' },
]

const thirdRowList: ImageList[] = [
  { imgAlt: 'equipo de gotas de luz', imgSrc: '/assets/img/crew-img.png' },
  { imgAlt: 'Niña sonriendo', imgSrc: '/assets/img/girl-smiling.png' },
  { imgAlt: 'Niños posando para una tomarse una fotografía', imgSrc: '/assets/img/event-activities.jpg' },
]

const AboutUs = () => {
  return (
    <Box
      maxW="5xl"
      mx="auto"
      my={responsiveProperty({ mobileSize: 3, desktopSize: 4, unit: 'rem' })}
      alignItems="center"
    >
      <Text variant="title" textAlign="center" margin="auto">
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
      <Carousel settings={{ speed: 20000 }} imagesList={[...firstRowList, ...firstRowList]} />
      <Carousel settings={{ rtl: true, speed: 20000 }} imagesList={[...secondRowList, ...secondRowList]} />
      <Carousel settings={{ speed: 15000 }} imagesList={[...thirdRowList, ...thirdRowList]} />
    </Box>
  )
}

export default AboutUs
