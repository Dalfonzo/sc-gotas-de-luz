import { Box, BoxProps, Text } from '@chakra-ui/react'
import { responsiveProperty } from '~/theme/utils'

const DonatorCard = (props: BoxProps) => {
  return (
    <Box
      padding={responsiveProperty({ mobileSize: 1, desktopSize: 2, unit: 'rem' })}
      boxShadow=" 0px 0px 20px 0px #0000001A"
      borderRadius="5px"
      maxW={responsiveProperty({ mobileSize: 300, desktopSize: 450 })}
      {...props}
    >
      <Box display="flex" alignItems="center" marginBottom="1rem">
        <Box
          borderRadius="50%"
          background="#FFF06F3B"
          display="inline-block"
          height="3em"
          width="3em"
          fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 18 })}
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
        <Text
          marginLeft="25px"
          fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 18 })}
          fontWeight="bold"
          color="text.dark"
        >
          Lester Peñaloza
        </Text>
        <Text
          marginLeft="auto"
          fontSize={responsiveProperty({ mobileSize: 16, desktopSize: 25 })}
          color="aqua.light"
          fontWeight="bold"
        >
          20$
        </Text>
      </Box>
      <Text variant="normal">“Lorem ipsum dolor sit amet, consectetur adipiscing elit.”</Text>
    </Box>
  )
}

export default DonatorCard
