import { Box, Button, Image, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'
import DonatorCard from './DonatorCard'

const LatestDonators = () => {
  return (
    <Box as="section" px="1rem">
      <Box
        display="flex"
        alignItems="center"
        flexDir={{ base: 'column', lg: 'row' }}
        gap={{ base: '2rem', md: '3rem', lg: '4rem' }}
      >
        <Box width={{ base: '100%', lg: '40%' }} alignSelf={{ base: 'flex-start', lg: 'unset' }}>
          <Text variant="subtitle" as="h2">
            Nuestros últimos benefactores
          </Text>
          <Text variant="normal" marginTop={responsiveProperty({ mobileSize: 0.5, desktopSize: 2, unit: 'rem' })}>
            ¡Gracias a todos los que hacen esto posible!
          </Text>
        </Box>
        <Box
          width="fit-content"
          display="flex"
          flexDirection="column"
          gap="1.5rem"
          marginLeft={{ base: 'unset', sm: '130px', lg: 'auto' }}
          position="relative"
        >
          <Image
            src="assets/svg/arrow.svg"
            alt="arrow"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            left={responsiveProperty({ mobileSize: -40, desktopSize: -30, unit: '%' })}
            display={{ base: 'none', sm: 'unset' }}
          />
          <DonatorCard marginLeft={{ base: 'unset', sm: '-2rem' }} />
          <DonatorCard />
          <DonatorCard marginLeft={{ base: 'unset', sm: '-5rem' }} />
        </Box>
      </Box>
      <Button
        display="block"
        width="fit-content"
        margin="auto"
        variant="btn-white-border"
        color="aqua.light"
        marginTop={{ base: '2rem', sm: '3rem', md: '4rem' }}
      >
        Ver todos
      </Button>
    </Box>
  )
}

export default LatestDonators
