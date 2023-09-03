import { Box, BoxProps, Text } from '@chakra-ui/react'
import withAnimation from '~/hoc/withAnimation'
import { responsiveProperty } from '~/theme/utils'
import LinkButton from '../link-button/LinkButton'

interface SectionCardProps extends Omit<BoxProps, 'title'> {
  title: JSX.Element
  linkText: string
  href: string
  bodyContent: string
}

const SectionCard = ({ title, linkText, href, bodyContent, ...rest }: SectionCardProps) => {
  return (
    <Box
      maxW="5xl"
      mx="auto"
      my={responsiveProperty({ mobileSize: 1, desktopSize: 4, unit: 'rem' })}
      alignItems="center"
      padding={{ base: '50px 35px', sm: '50px 70px', md: '100px 140px' }}
      borderRadius={{ base: 20, md: '40' }}
      {...rest}
    >
      <Text variant="title" textAlign="center" margin="auto">
        {title}
      </Text>
      <Text textAlign="center" variant="normal" marginTop="25px">
        {bodyContent}
      </Text>
      <LinkButton
        withArrow={false}
        href={href}
        content={linkText}
        variant="lnk-btn-black"
        margin={{ base: '20px auto 0', sm: '50px auto 0', md: '70px auto 0' }}
        width="fit-content"
        display="block"
      />
    </Box>
  )
}

export default withAnimation(SectionCard)
