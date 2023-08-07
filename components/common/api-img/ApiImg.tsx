import { Flex, Image, ImageProps, Text } from '@chakra-ui/react'
import { BiImage } from 'react-icons/bi'

interface Props extends ImageProps {
  url?: string | { url: string; isCloud?: boolean }
  emptySize?: string
}
export const ApiImg = ({ url, src, emptySize = '4rem', ...rest }: Props) => {
  const getSrc = () =>
    src
      ? src
      : !url
      ? undefined
      : typeof url !== 'string' && url.isCloud
      ? url.url
      : `/api/storage/${typeof url === 'string' ? url : url.url}`

  if (!getSrc()) {
    return (
      <Flex {...rest} align="center" direction="column" gap="1">
        <BiImage height="100%" size={emptySize} />
        <Text fontSize="xs" fontWeight="thin">
          Imagen no encontrada
        </Text>
      </Flex>
    )
  }
  return <Image src={getSrc()} {...rest} />
}
