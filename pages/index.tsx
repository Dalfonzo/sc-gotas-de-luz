import Head from 'next/head'
import DonationBanner from '~/components/client/common/donation-banner'
import AboutUs from '~/components/client/landing/about-us'
import Hero from '~/components/client/landing/hero'
import IncomingEvents from '~/components/client/landing/incoming-events'
import SupportUs from '~/components/client/landing/support-us'
import Volunteers from '~/components/client/landing/volunteers'
import ClientLayout from '~/layouts/Client'

const Home = () => {
  return (
    <ClientLayout>
      <div>
        <Head>
          <title>Gotas de Luz | Inicio</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Hero />
        <AboutUs />
        <SupportUs />
        <Volunteers />
        <IncomingEvents />
        <DonationBanner />
      </div>
    </ClientLayout>
  )
}

export default Home
