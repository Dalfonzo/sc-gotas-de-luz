import { Box, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'
import { responsiveProperty } from '~/theme/utils'

const DonationBanner = () => {
  return (
    <Box
      maxW="7xl"
      margin="auto"
      marginTop={responsiveProperty({ mobileSize: 3, desktopSize: 10, unit: 'rem' })}
      padding="0 1rem"
    >
      <Box padding="2rem" background="yellow" borderRadius="5px" display="flex">
        <Box width={{ base: '1000%', lg: '52%' }}>
          <Text as="h2" variant="subtitle-no-decoration" marginBottom="2rem">
            Súmate a la movida y <br />
            ¡Haz un donativo!
          </Text>
          <Text variant="normal" marginBottom="1.5rem">
            Tu donación nos permitirá continuar con nuestras actividades y mejorar la calidad de vida de muchas
            personas. Haz tu aporte y nosotros nos encargaremos de hacerlo llegar a quienes más lo necesitan.
          </Text>
          <LinkButton
            href="/donate"
            variant="lnk-btn-white"
            content="Donar"
            display={{ base: 'block', lg: 'inline-block' }}
            marginLeft={{ base: 'auto', lg: 'unset' }}
            width={{ base: 'fit-content', lg: 'unset' }}
          />
        </Box>
        <Box width="50%" position="relative" display={{ base: 'none', lg: 'unset' }}>
          <Image
            src="assets/img/banner-bg.png"
            alt="pareja de ancianos"
            position="absolute"
            bottom="-2rem"
            right="-2rem"
          />
        </Box>
      </Box>
    </Box>
  )
}

export default DonationBanner
