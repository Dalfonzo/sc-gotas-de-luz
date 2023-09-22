import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import Content from '~/components/client/about/content'
import Heading from '~/components/client/about/heading'
import ClientLayout from '~/layouts/Client'
import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'

const Home = () => {
  return (
    <ClientLayout>
      <NextSeo {...META.about} />
      <Box maxW="5xl" margin="auto">
        <Heading />
        <Content />
      </Box>
    </ClientLayout>
  )
}

export default Home
