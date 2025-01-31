import Head from 'next/head'
import { NewsFeed } from '~/components/client/news/Feed'
import ClientLayout from '~/layouts/Client'

const NewsPage = () => {
  return (
    <ClientLayout>
      <Head>
        <title>Novedades - Gotas de Luz</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NewsFeed />
    </ClientLayout>
  )
}

export default NewsPage
