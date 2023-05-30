import { TimeIcon } from '@chakra-ui/icons'
import { Box, Image, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { responsiveProperty } from '~/theme/utils'
import CardI, { CardPreviewI } from './CardI'

const NewsCard = ({ img, title, content, date, ...rest }: CardI | CardPreviewI) => {
  const padding = responsiveProperty({ mobileSize: 1, desktopSize: 2, unit: 'rem' })
  const link = 'id' in rest && '/news/' + rest.id
  const CardImg = (
    <Image
      paddingX={responsiveProperty({ mobileSize: -1, desktopSize: -2, unit: 'rem' })}
      src={img}
      width="100%"
      height="15rem"
      alt="imagen"
      marginBottom="1rem"
      className="fade"
      objectFit="cover"
    />
  )
  return (
    <Box maxWidth="100%">
      <Text
        fontSize={responsiveProperty({ mobileSize: 16, desktopSize: 20 })}
        fontWeight="bold"
        color="text.dark"
        marginBottom="1rem"
      >
        {link ? <Link href={link}>{title}</Link> : title}
      </Text>

      <Box
        paddingBottom={padding}
        boxShadow=" 0px 0px 20px 0px #0000001A"
        borderRadius="5px"
        width={400}
        maxWidth={'100%'}
        {...rest}
      >
        {link ? <Link href={link}>{CardImg}</Link> : CardImg}
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
        {link && (
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
        )}
      </Box>
    </Box>
  )
}

export default NewsCard
