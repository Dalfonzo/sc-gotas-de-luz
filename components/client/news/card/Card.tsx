import { TimeIcon } from '@chakra-ui/icons'
import { Box, Image, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { responsiveProperty } from '~/theme/utils'
import CardI from './CardI'

const NewsCard = ({ img, title, content, date, id, ...rest }: CardI) => {
  const padding = responsiveProperty({ mobileSize: 1, desktopSize: 2, unit: 'rem' })
  const link = '/news/' + id
  return (
    <Box maxWidth="99vw">
      <Text
        fontSize={responsiveProperty({ mobileSize: 16, desktopSize: 20 })}
        fontWeight="bold"
        color="text.dark"
        marginBottom="1rem"
      >
        <Link href={link}>{title}</Link>
      </Text>

      <Box
        paddingBottom={padding}
        boxShadow=" 0px 0px 20px 0px #0000001A"
        borderRadius="5px"
        width={['95%', '85%', 400]}
        {...rest}
      >
        <Link href={link}>
          <Image
            paddingX={responsiveProperty({ mobileSize: -1, desktopSize: -2, unit: 'rem' })}
            src={img}
            width="100%"
            height="15rem"
            alt=""
            marginBottom="1rem"
            className="fade"
            objectFit="cover"
          />
        </Link>
        <Text paddingX={padding} fontWeight="thin" fontSize="sm" marginBottom="1rem">
          <TimeIcon /> &nbsp;
          {formatDistanceToNow(date, { locale: es, addSuffix: true })}
        </Text>
        <Text
          paddingX={padding}
          noOfLines={4}
          variant="normal"
          dangerouslySetInnerHTML={{
            __html: content,
          }}
        ></Text>
        <Box
          paddingX={padding}
          display="block"
          width="fit-content"
          marginLeft="auto"
          marginTop="1rem"
          fontWeight="bold"
          color="yellow"
        >
          <Link href={link}>Leer más</Link>
        </Box>
      </Box>
    </Box>
  )
}

export default NewsCard
