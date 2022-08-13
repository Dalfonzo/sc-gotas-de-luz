import { Flex, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const AboutUs = () => {
  return (
    <Flex
      maxW="7xl"
      mx="auto"
      my={responsiveProperty({ mobileSize: 3, desktopSize: 10, unit: 'rem' })}
      alignItems="center"
      padding="0 1rem"
      flexDir={{ base: 'column', md: 'row' }}
    >
      <Text variant="subtitle" width={{ base: '100%', md: '40%' }} marginRight={{ base: 'auto', md: 'unset' }}>
        Gotas de Luz
      </Text>
      <Text
        variant="normal"
        width={{ base: '80%', md: '60%' }}
        mx={{ base: 'auto', md: 'unset' }}
        marginTop={{ base: '2rem', md: 'unset' }}
      >
        Conservando nuestra esencia, realizamos diferentes actividades con el objetivo de dar a las personas algo más
        que un aporte material. Queremos darle una gota de luz en medio de este mar de oscuridad.
      </Text>
    </Flex>
  )
}

export default AboutUs
