import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { Box, Button, Flex } from '@chakra-ui/react'
import { News } from '@prisma/client'
import Link from 'next/link'
import { BackButton } from '../../common/back-button/BackButton'
import { NewsArticle } from './Article'

interface Props {
  current: News
  next?: number
  previous?: number
}

export const ArticleProvider = ({ current, previous, next }: Props) => {
  return (
    <Box maxW="100%" p="0rem" width="1080px" mx="auto">
      <BackButton />

      <NewsArticle news={current} />
      <Flex px="2rem" mt="5" justify="center" gap={20}>
        {previous && (
          <Link href={`/news/${previous}`}>
            <Button width="10rem" leftIcon={<ArrowBackIcon />} variant="btn-white-border">
              Anterior
            </Button>
          </Link>
        )}
        {next && (
          <Link href={`/news/${next}`}>
            <Button width="10rem" rightIcon={<ArrowForwardIcon />} variant="btn-white-border">
              Siguiente
            </Button>
          </Link>
        )}
      </Flex>
    </Box>
  )
}
