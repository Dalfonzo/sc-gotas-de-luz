import { Box, Flex, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Hero = () => {
  return (
    <Flex as="section" flexDir="column" alignItems="center" justifyContent="center" height="90vh">
      <Box
        bgImage="url('/assets/svg/brush-stroke-3.svg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="contain"
        width="100%"
        height="100%"
        maxW={1140}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Box marginTop={responsiveProperty({ mobileSize: 3, desktopSize: 5, unit: 'rem' })}>
          <Text variant="title" textAlign="center" mt="-10rem">
            Iluminando <br />
            momentos para <br />
            generar vida
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default Hero
