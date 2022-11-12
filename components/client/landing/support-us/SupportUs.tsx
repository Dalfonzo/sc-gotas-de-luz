import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import LinkButton from '../../common/link-button'

const SupportUs = () => {
  return (
    <Box my={responsiveProperty({ mobileSize: 3, desktopSize: 10, unit: 'rem' })}>
      <Text variant="title" textAlign="center" margin="auto" color="aqua.light">
        Apóyanos
      </Text>
      <Text
        variant="normal"
        width={{ base: '80%', sm: '70%', md: '60%' }}
        margin={{ base: '2rem auto', sm: '3rem auto', md: '4rem auto' }}
        textAlign="center"
      >
        Si quieres poner manos a la obra, puedes registrate como voluntario y acompañarnos en nuestra hermosa labor. Si
        prefieres no involucrarte de manera directa, puedes hacer donaciones de alimentos, dinero, ropa y cualquier otra
        cosa que desees.
      </Text>
      <LinkButton
        href="/donate"
        variant="lnk-btn-black"
        content="Donar"
        marginTop="4rem"
        mx="auto"
        position="relative"
        display="block"
        width="fit-content"
        withArrow={false}
      />
    </Box>
  )
}

export default SupportUs
