import { Box, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const Heading = () => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h1" variant="title" marginBottom="4rem" textAlign="center">
        Novedades
      </Text>
      <Text variant="normal" px="2rem">
        Labore ea Lorem cillum laborum sint duis esse enim adipisicing adipisicing non. Laborum anim ullamco amet aute
        commodo. Nostrud nulla commodo anim id ullamco officia do aliqua amet. Sint amet ut commodo deserunt deserunt
        qui. Deserunt exercitation est labore ea elit.
      </Text>
    </Box>
  )
}

export default Heading
