import { AspectRatio, Box, Flex, FlexProps, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'

interface CardI extends FlexProps {
  title: string
  description: string
  imgSrc: string
  imgAlt: string
  linkHref: string
  linkText: string
  rtl?: boolean
}

const Card = ({ title, description, imgSrc, imgAlt, linkHref, rtl, linkText, ...rest }: CardI) => (
  <Flex maxW="7xl" margin="10rem auto" alignItems="flex-start" {...rest} flexDir={rtl ? 'row-reverse' : 'row'}>
    <AspectRatio width="40%" ratio={1.7}>
      <Image src={imgSrc} alt={imgAlt} borderRadius="5px" />
    </AspectRatio>
    <Box width="50%" margin={rtl ? '0 auto 0 0' : '0 0 0 auto'}>
      <Text variant="subtitle" marginBottom="2.5rem" as="h2">
        {title}
      </Text>
      <Text variant="normal" marginBottom="2.5rem">
        {description}
      </Text>
      <LinkButton href={linkHref} content={linkText} variant="lnk-btn-primary" />
    </Box>
  </Flex>
)

export default Card
