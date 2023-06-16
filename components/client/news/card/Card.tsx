import { TimeIcon } from '@chakra-ui/icons'
import { Box, Flex, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { responsiveProperty } from '~/theme/utils'
import CardI, { CardPreviewI } from './CardI'

const NewsCard = ({ img, title, content, date, ...rest }: CardI | CardPreviewI) => {
  const padding = responsiveProperty({ mobileSize: 1, desktopSize: 2, unit: 'rem' })
  const link = 'id' in rest && '/news/' + rest.id
  const CardImg = (
    <ApiImg
      url={img}
      width="100%"
      height="15rem"
      alt="imagen"
      marginBottom="1rem"
      className="fade"
      borderTopRadius="lg"
      objectFit="cover"
    />
  )
  return (
    <Box maxWidth="100%">
      <Box
        paddingBottom={padding}
        boxShadow=" 5px 5px 15px 1px #0000001A"
        borderRadius="lg"
        width={400}
        maxWidth={'100%'}
        {...rest}
      >
        {link ? <Link href={link}>{CardImg}</Link> : CardImg}
        <Text
          fontSize={responsiveProperty({ mobileSize: 18, desktopSize: 22 })}
          fontWeight="bold"
          color="text.dark"
          marginBottom="1rem"
          paddingX={padding}
        >
          {link ? <Link href={link}>{title}</Link> : title}
        </Text>
        <Flex align="center" gap={2} paddingX={padding} marginBottom="1rem">
          <TimeIcon />
          <Text fontWeight="light" fontSize="sm">
            {formatDistanceToNow(date, { locale: es, addSuffix: true })}
          </Text>
        </Flex>
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
            color="blue.400"
          >
            <Link href={link}>Leer más</Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default NewsCard
