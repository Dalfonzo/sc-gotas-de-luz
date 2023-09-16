import { Box, BoxProps, Text } from '@chakra-ui/react'

const HeadingWithDecoration = ({ title, ...rest }: { title: string | JSX.Element } & BoxProps) => {
  return (
    <Box position={'relative'} {...rest}>
      <Box marginBottom="4rem" zIndex={2}>
        {typeof title === 'string' ? (
          <Text as="h1" variant="title" textAlign="center">
            {title}
          </Text>
        ) : (
          title
        )}
      </Box>
      <Box
        bgImage="url('/assets/svg/landing-bg.svg')"
        bgPosition="center"
        bgRepeat="no-repeat"
        bgSize="contain"
        width="100%"
        height={{ base: 150, sm: 250, md: 350 }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position={'absolute'}
        top="60%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex={'-1'}
      />
    </Box>
  )
}

export default HeadingWithDecoration
