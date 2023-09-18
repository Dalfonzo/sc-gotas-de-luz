import { Box, Flex, Text } from '@chakra-ui/react'
import withAnimation from '~/hoc/withAnimation'

const Hero = () => {
  return (
    <Flex
      as="section"
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      height={{ base: '350px', sm: '60vh', md: '80vh' }}
      maxH={720}
    >
      <Box
        bgImage="url('/assets/svg/landing-bg.svg')"
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
        <Box>
          <Text variant="title" textAlign="center">
            Iluminando <br />
            momentos para <br />
            generar vida
          </Text>
        </Box>
      </Box>
    </Flex>
  )
}

export default withAnimation(Hero)
