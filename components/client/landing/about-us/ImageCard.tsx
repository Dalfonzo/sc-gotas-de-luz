import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react'

interface ImageCardI extends BoxProps {
  imgSrc: string
  imgAlt: string
}

const ImageCard = ({ imgSrc, imgAlt, ...rest }: ImageCardI) => {
  return (
    <Box
      _even={{ marginLeft: { base: '2rem', sm: '4rem' } }}
      _odd={{ marginRight: { base: '2rem', sm: '4rem' } }}
      {...rest}
      position="relative"
    >
      <AspectRatio
        width={{ base: '90%', sm: '80%', md: '70%' }}
        mx={'auto'}
        ratio={{ base: 2, sm: 2.5, md: 3 }}
        marginBottom={{ base: '2rem', sm: '4rem', md: '6rem' }}
      >
        <Image src={imgSrc} alt={imgAlt} borderRadius="20px" />
      </AspectRatio>
    </Box>
  )
}

export default ImageCard
