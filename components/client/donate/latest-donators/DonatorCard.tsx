import { Box, BoxProps, Text } from '@chakra-ui/react'

const DonatorCard = (props: BoxProps) => {
  return (
    <Box padding="2rem" boxShadow=" 0px 0px 20px 0px #0000001A" borderRadius="5px" maxW="450px" {...props}>
      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box
          borderRadius="50%"
          background="#FFF06F3B"
          display="inline-block"
          height="3em"
          width="3em"
          fontSize="18px"
          position="relative"
        >
          <Text
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            flexShrink="0"
            color="text.dark"
          >
            LP
          </Text>
        </Box>
        <Text marginLeft="25px" fontSize="18px" fontWeight="bold" color="text.dark">
          Lester Peñaloza
        </Text>
        <Text marginLeft="auto" fontSize="25px" color="aqua.light" fontWeight="bold">
          20$
        </Text>
      </Box>
      <Text>“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</Text>
    </Box>
  )
}

export default DonatorCard
