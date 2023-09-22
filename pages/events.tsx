import { Box } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'
import Calendar from '~/components/client/events/calendar/index'
import Heading from '~/components/client/events/heading/Heading'
import withAnimation from '~/hoc/withAnimation'
import ClientLayout from '~/layouts/Client'
const PageBody = () => {
  return (
    <Box>
      <Heading />
      <Calendar />
    </Box>
  )
}

const Events = () => {
  const WithAnimationComponent = withAnimation(PageBody)

  return (
    <ClientLayout>
      <NextSeo {...META.events} />
      <WithAnimationComponent />
    </ClientLayout>
  )
}
export default Events
