import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import News from '~/components/client/news/content/News'
import Heading from '~/components/client/news/heading/Heading'
import ClientLayout from '~/layouts/Client'

const NewsPage = () => {
  return (
    <ClientLayout>
      <Head>
        <title>Novedades - Gotas de Luz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Heading />
        <News />
      </Box>
    </ClientLayout>
  )
}

export default NewsPage
