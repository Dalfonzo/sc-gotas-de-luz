import { Box } from '@chakra-ui/react'
import Head from 'next/head'
import { DonateProvider } from '~/components/client/donate/donate-context.provider'
import DonationFormHeading from '~/components/client/donate/donation-form/Heading'
import Heading from '~/components/client/donate/heading'
import LatestDonators from '~/components/client/donate/latest-donators'
import ClientLayout from '~/layouts/Client'
import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'

const Donate = () => {
  return (
    <ClientLayout>
      <NextSeo {...META.donate} />
      <DonateProvider>
        <Box maxW="5xl" margin="auto">
          <Heading />
          <DonationFormHeading />
          <Box marginY="5rem" />
          <LatestDonators />
        </Box>
      </DonateProvider>
    </ClientLayout>
  )
}

export default Donate
