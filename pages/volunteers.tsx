import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'
import { VolunteersLayout } from '~/components/client/volunteers/Layout'
import withAnimation from '~/hoc/withAnimation'
import ClientLayout from '~/layouts/Client'

const Volunteers = () => {
  const VolunteersWithAnimation = withAnimation(VolunteersLayout)
  return (
    <ClientLayout>
      <NextSeo {...META.volunteers} />
      <VolunteersWithAnimation />
    </ClientLayout>
  )
}

export default Volunteers
