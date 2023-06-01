import { Image, ImageProps } from '@chakra-ui/react'

interface Props extends ImageProps {
  url: string | { url: string }
}
export const ApiImg = ({ url, src, ...rest }: Props) => {
  const getSrc = () => src || `/api/storage/${typeof url === 'string' ? url : url.url}`
  return <Image src={getSrc()} {...rest} />
}
