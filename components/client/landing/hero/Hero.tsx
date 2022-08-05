import { Box, Flex, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'

const Hero = () => {
  return (
    <Flex as="section" position="relative">
      <Box
        width="100%"
        maxW="7xl"
        margin="auto"
        position="absolute"
        left="50%"
        top="50%"
        transform="translate(-50%, -50%)"
        zIndex="1"
      >
        <Box width="65%">
          <Text variant="title" marginBottom="2rem">
            Iluminando momentos para generar vida
          </Text>
          <Text variant="normal" width="60%" fontSize="25px" marginBottom="2.5rem">
            Somos un grupo de jóvenes dispuestos a asistir a la población más vulnerable
          </Text>
          <LinkButton href="/donate" variant="lnk-btn-primary" content="Donar" />
        </Box>
      </Box>
      <Box width="50%" />
      <Box width="50%" position="relative" maxHeight="750px">
        <Image src="/assets/svg/hero-bg-deco.svg" alt="decoration" position="absolute" top="0" left="0" />
        <Image src="/assets/img/hero-bg.png" alt="Niños sonriendo" width="100%" height="100%" objectFit="cover" />
      </Box>
    </Flex>
  )
}

export default Hero
