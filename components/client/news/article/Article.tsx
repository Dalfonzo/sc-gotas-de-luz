import { EmailIcon, TimeIcon } from '@chakra-ui/icons'
import { Box, Divider, Flex, Heading, IconButton, Link, Text } from '@chakra-ui/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import { useRouter } from 'next/router'
import { BiUser } from 'react-icons/bi'
import { FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import getURL from '~/lib/fetcher/get-url'
import { NewsI } from '~/lib/models/news'

interface Props {
  news: Omit<NewsI, 'img'> & { author?: string; img?: string; imgSrc?: string }
}

export const NewsArticle = ({ news }: Props) => {
  const router = useRouter()
  const currentUrl = getURL(router.asPath)
  const shareText = `"${news.title}" publicado en Gotas de Luz: `
  const ShareIcons = [
    {
      icon: <FaTwitter />,
      label: 'Twitter',
      props: {
        href: `https://twitter.com/intent/tweet?original_referer=${getURL('')}&text=${shareText}&url=${currentUrl}`,
      },
    },
    {
      icon: <FaFacebook />,
      label: 'Facebook',
      props: {
        href: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}&src=sdkpreparse`,
      },
    },
    {
      icon: <FaWhatsapp />,
      label: 'Whatsapp',
      props: {
        href: `https://api.whatsapp.com/send?text=${shareText}%0a%0a${currentUrl}`,
      },
    },
    {
      icon: <EmailIcon />,
      label: 'Email',
      props: {
        href: `mailto:?body=${shareText}${currentUrl}&subject=${news.title}`,
      },
    },
  ]

  return (
    <Box maxW="100%" p="2rem" width="1080px" mx="auto">
      <Heading mb="5">{news.title}</Heading>
      <Divider my="3" />
      <Flex px="1" fontWeight="light" fontSize="sm" gap={1} my="3" wrap="wrap" justifyContent="space-between">
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
          <Link isExternal {...icon.props} key={index}>
            <IconButton size="lg" variant="ghost" key={index} aria-label={icon.label}>
              {icon.icon}
            </IconButton>
          </Link>
        ))}
      </Flex>
    </Box>
  )
}
