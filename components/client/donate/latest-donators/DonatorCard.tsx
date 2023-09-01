import { Box, BoxProps, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { responsiveProperty } from '~/theme/utils'
interface Props extends BoxProps {
  name: string
  amount: number
  comment: string
  date: Date
}
const DonatorCard = ({ name, amount, comment, date, ...rest }: Props) => {
  const getInitials = () => `${name.split(' ').at(0)?.charAt(0) ?? ''}${name.split(' ').at(1)?.charAt(0) ?? ''}`
  return (
    <Box
      padding={responsiveProperty({ mobileSize: 1, desktopSize: 2, unit: 'rem' })}
      boxShadow=" 0px 0px 20px 0px #0000001A"
      borderRadius="5px"
      maxW={responsiveProperty({ mobileSize: 300, desktopSize: 450 })}
      {...rest}
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
            {getInitials()}
          </Text>
        </Box>
        <Text
          marginLeft="25px"
          fontSize={responsiveProperty({ mobileSize: 14, desktopSize: 18 })}
          fontWeight="bold"
          color="text.dark"
          marginRight={2}
        >
          {name}
        </Text>
        <Text
          marginLeft="auto"
          fontSize={responsiveProperty({ mobileSize: 16, desktopSize: 25 })}
          color="aqua.light"
          fontWeight="bold"
        >
          {amount.toFixed(0)}$
        </Text>
      </Box>
      <Text variant="normal" fontStyle="italic">
        “{comment}”
      </Text>
      <Text align="right" fontSize="sm" color="dimgray">
        Hace {formatDistanceToNow(date, { locale: es })}
      </Text>
    </Box>
  )
}

export default DonatorCard
