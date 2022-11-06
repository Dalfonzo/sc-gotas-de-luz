import { Box, Text } from '@chakra-ui/react'
import LinkButton from '../../common/link-button'

const InfoCard = ({ title, content, link }: any) => {
  return (
    <Box
      _even={{ marginTop: { base: 'unset', md: '10rem' } }}
      padding="2rem"
      maxWidth={{ base: '400px', md: '100%' }}
      mx={{ base: 'auto', md: 'unset' }}
    >
      <Text variant="subtitle-no-decoration" color="aqua.light" mb="2rem" textAlign={{ base: 'center', md: 'unset' }}>
        {title}
      </Text>
      <Text variant="normal" textAlign={{ base: 'center', md: 'unset' }}>
        {content}
      </Text>
      <LinkButton
        href={link}
        variant="lnk-btn-black"
        content="Ver más"
        marginTop="4rem"
        width={{ base: 'fit-content' }}
        display={{ base: 'block' }}
        mx={{ base: 'auto', md: 'unset' }}
      />
    </Box>
  )
}

export default InfoCard
