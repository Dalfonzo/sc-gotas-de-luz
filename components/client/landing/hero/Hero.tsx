import { AspectRatio, Box, Flex, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'
import { responsiveProperty } from '~/theme/utils'

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
        <Box
          width={responsiveProperty({ mobileSize: 100, desktopSize: 65, unit: '%' })}
          display={{ base: 'flex', sm: 'block' }}
          flexDir={{ base: 'column', sm: 'unset' }}
          alignItems={{ base: 'center', sm: 'unset' }}
          justifyContent={{ base: 'center', sm: 'unset' }}
          padding={{ base: 'unset', sm: '0 1rem' }}
        >
          <Text
            variant="title"
            marginBottom={responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' })}
            textAlign={{ base: 'center', sm: 'unset' }}
            width={{ base: '90%', sm: '100%' }}
          >
            Iluminando momentos para generar vida
          </Text>
          <Text
            variant="normal"
            width={responsiveProperty({ mobileSize: 85, desktopSize: 60, unit: '%' })}
            fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 25 })}
            marginBottom={responsiveProperty({ mobileSize: 1, desktopSize: 2.5, unit: 'rem' })}
            textAlign={{ base: 'center', sm: 'unset' }}
          >
            Somos un grupo de jóvenes dispuestos a asistir a la población más vulnerable
          </Text>
          <LinkButton href="/donate" variant="lnk-btn-primary" content="Donar" />
        </Box>
      </Box>
      <Box width="50%" />
      <AspectRatio
        width={responsiveProperty({ mobileSize: 70, desktopSize: 50, unit: '%' })}
        position="relative"
        ratio={{ base: 0.6, sm: 0.8 }}
        maxHeight="750px"
        pointerEvents="none"
        overflow="hidden"
      >
        <Box>
          <Image
            src="/assets/svg/hero-bg-deco.svg"
            alt="decoration"
            position="absolute"
            top="0"
            left="0"
            width="40%"
            maxWidth="250px"
          />
          <Image
            src="/assets/img/hero-bg.png"
            alt="Mujer sosteniendo a una niña"
            width="100%"
            height="100%"
            objectFit="cover"
            display={{ base: 'none', sm: 'unset' }}
            objectPosition="left"
          />
        </Box>
      </AspectRatio>
    </Flex>
  )
}

export default Hero
