import { Box } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'
import Calendar from '~/components/client/events/calendar/index'
import Heading from '~/components/client/events/heading/Heading'
import withAnimation from '~/hoc/withAnimation'
import ClientLayout from '~/layouts/Client'

const Events = () => {
  return (
    <ClientLayout>
      <NextSeo {...META.events} />
      <Box>
        <Heading />
        <Calendar />
      </Box>
    </ClientLayout>
  )
}
export default withAnimation(Events)
