import { EmailIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Divider, Flex, Heading, IconButton, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { BiUser } from 'react-icons/bi'
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import { NewsI } from '~/lib/models/news'
import { BackButton } from '../../common/back-button/BackButton'

interface Props {
  news: Omit<NewsI, 'img'> & { author?: string; img?: string; imgSrc?: string }
}
// TODO: check to add social media links
const ShareIcons = [
  {
    icon: <FaTwitter />,
    label: 'Twitter',
  },
  {
    icon: <FaFacebook />,
    label: 'Facebook',
  },
  {
    icon: <FaWhatsapp />,
    label: 'Whatsapp',
  },
  {
    icon: <EmailIcon />,
    label: 'Email',
  },
]

export const NewsArticle = ({ news }: Props) => {
  return (
    <Box maxW="100%" p="2rem" width="1080px" mx="auto">
      <BackButton mb="2" />
      <Heading mb="5">{news.title}</Heading>
      <Divider my="3" />
      <Flex px="1" fontWeight="thin" fontSize="sm" gap={1} my="3" wrap="wrap" justifyContent="space-between">
        <Flex align="center">
          <BiUser />
          <Text>&nbsp; Por: {news.author || 'Gotas de Luz'}</Text>
        </Flex>
        <Text>
          <TimeIcon /> &nbsp; Publicado: {formatDistanceToNow(news.date || new Date(), { locale: es, addSuffix: true })}
        </Text>
      </Flex>
      <Divider my="3" />

      <ApiImg my="5" src={news.imgSrc} url={news.img} width="100%" maxH="20rem" objectFit="cover" alt="image" />
      <Box mb="10" className="ql-editor" dangerouslySetInnerHTML={{ __html: news.content }}></Box>
      <Heading my="5" size="md" textAlign="center">
        ¡Comparte este artículo!
      </Heading>
      <Flex mx="auto" gap="5" justify="center" color="primary">
        {ShareIcons.map((icon, index) => (
          <IconButton size="lg" variant="ghost" key={index} aria-label={icon.label}>
            {icon.icon}
          </IconButton>
        ))}
      </Flex>
    </Box>
  )
}
