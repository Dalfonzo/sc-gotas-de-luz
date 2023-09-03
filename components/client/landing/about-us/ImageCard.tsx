import { AspectRatio, Box, BoxProps, Image } from '@chakra-ui/react'

interface ImageCardI extends BoxProps {
  imgSrc: string
  imgAlt: string
}

const ImageCard = ({ imgSrc, imgAlt, ...rest }: ImageCardI) => {
  return (
    <Box {...rest} position="relative">
      <AspectRatio ratio={{ base: 2, sm: 2.5, md: 1.8 }}>
        <Image src={imgSrc} alt={imgAlt} borderRadius="20px" />
      </AspectRatio>
    </Box>
  )
}

export default ImageCard
