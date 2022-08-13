import { AspectRatio, Box, Flex, FlexProps, Image, Text } from '@chakra-ui/react'
import LinkButton from '~/components/client/common/link-button'
import { responsiveProperty } from '~/theme/utils'

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
  <Flex
    maxW="7xl"
    mx="auto"
    my={responsiveProperty({ mobileSize: 3, desktopSize: 10, unit: 'rem' })}
    alignItems="flex-start"
    flexDir={{ base: 'column', md: rtl ? 'row-reverse' : 'row' }}
    {...rest}
    padding="0 1rem"
  >
    <AspectRatio
      width={{ base: '80%', md: '40%' }}
      mx={{ base: 'auto', md: 'unset' }}
      ratio={1.7}
      marginBottom={{ base: '3rem', md: 'unset' }}
    >
      <Image src={imgSrc} alt={imgAlt} borderRadius="5px" />
    </AspectRatio>
    <Box width={{ base: '100%', md: '50%' }} margin={{ base: 'unset', md: rtl ? '0 auto 0 0' : '0 0 0 auto' }}>
      <Text variant="subtitle" marginBottom="2.5rem" as="h2">
        {title}
      </Text>
      <Text
        variant="normal"
        width={{ base: '80%', md: 'unset' }}
        margin={{ base: '0 auto 2.5rem auto', md: '0 0 2.5rem 0' }}
      >
        {description}
      </Text>
      <LinkButton
        href={linkHref}
        content={linkText}
        variant="lnk-btn-primary"
        margin={{ base: '0 10%  0 auto', md: '0 0 2.5rem 0' }}
        display={{ base: 'block', md: 'inline-block' }}
        width={{ base: 'fit-content', md: 'unset' }}
      />
    </Box>
  </Flex>
)

export default Card
