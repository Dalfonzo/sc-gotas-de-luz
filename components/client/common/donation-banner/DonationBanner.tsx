import { Box, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'

const DonationBanner = () => {
  return (
    <Box
      padding="2rem"
      background="yellow"
      maxW="7xl"
      margin="auto"
      borderRadius="5px"
      display="flex"
      marginTop="14rem"
    >
      <Box width="50%">
        <Text as="h2" variant="subtitle-no-decoration" marginBottom="2rem">
          Súmate a la movida y <br />
          ¡Haz un donativo!
        </Text>
        <Text variant="normal" marginBottom="1.5rem">
          Tu donación nos permitirá continuar con nuestras actividades y mejorar la calidad de vida de muchas personas.
          Haz tu aporte y nosotros nos encargaremos de hacerlo llegar a quienes más lo necesitan.
        </Text>
        <LinkButton href="/donate" variant="lnk-btn-white" content="Donar" />
      </Box>
      <Box width="50%" position="relative">
        <Image
          src="assets/img/banner-bg.png"
          alt="pareja de ancianos"
          position="absolute"
          bottom="-2rem"
          right="-2rem"
        />
      </Box>
    </Box>
  )
}

export default DonationBanner
