import { Box, Button, Image, Text } from '@chakra-ui/react'
import DonatorCard from './DonatorCard'

const LatestDonators = () => {
  return (
    <Box as="section">
      <Box display="flex" alignItems="center">
        <Box width="40%">
          <Text variant="subtitle" as="h2">
            Nuestros últimos benefactores
          </Text>
          <Text variant="normal" marginTop="2rem">
            ¡Gracias a todos los que hacen esto posible!
          </Text>
        </Box>
        <Box
          width="fit-content"
          display="flex"
          flexDirection="column"
          gap="1.5rem"
          marginLeft="auto"
          position="relative"
        >
          <Image
            src="assets/svg/arrow.svg"
            alt="arrow"
            position="absolute"
            top="50%"
            transform="translateY(-50%)"
            left="-30%"
          />
          <DonatorCard marginLeft="-2rem" />
          <DonatorCard />
          <DonatorCard marginLeft="-5rem" />
        </Box>
      </Box>
      <Button
        display="block"
        width="fit-content"
        margin="auto"
        variant="btn-white-border"
        color="aqua.light"
        marginTop="4rem"
      >
        Ver todos
      </Button>
    </Box>
  )
}

export default LatestDonators
