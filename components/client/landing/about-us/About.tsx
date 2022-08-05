import { Flex, Text } from '@chakra-ui/react'

const AboutUs = () => {
  return (
    <Flex maxW="7xl" margin="10rem auto" alignItems="center">
      <Text variant="subtitle" width="35%">
        Gotas de Luz
      </Text>
      <Text variant="normal" width="55%">
        Conservando nuestra esencia, realizamos diferentes actividades con el objetivo de dar a las personas algo más
        que un aporte material. Queremos darle una gota de luz en medio de este mar de oscuridad.
      </Text>
    </Flex>
  )
}

export default AboutUs
