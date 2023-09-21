import { Box } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import { META } from '~/common/seo'
import SectionCard from '~/components/client/common/section-card'
import AboutUs from '~/components/client/landing/about-us'
import Hero from '~/components/client/landing/hero'
import ClientLayout from '~/layouts/Client'

const Home = () => {
  return (
    <ClientLayout>
      <div>
        <NextSeo {...META.home} />
        <Hero />
        <AboutUs />
        <Box px="1rem">
          <SectionCard
            bodyContent="Siempre estamos haciendo actividades en diversas partes del país. Puedes ver nuestro calendario y mantenerte al tanto de nuestras fechas y demás detalles."
            href="/events"
            title={
              <>
                Próximos
                <br />
                Eventos
              </>
            }
            linkText="Ver más"
            background="pastel.blue"
          />
          <SectionCard
            bodyContent="Si quieres poner manos a la obra, puedes registrate como voluntario y acompañarnos en nuestra hermosa labor. Si prefieres no involucrarte de manera directa, puedes hacer donaciones de alimentos, dinero, ropa y cualquier otra cosa que desees."
            href="/donate"
            title={<>Apóyanos</>}
            linkText="Donar"
            background="pastel.yellow"
          />
          <SectionCard
            bodyContent="No es necesario contar con mucho para ayudar a alguien más. Puedes postularte como voluntario en cualquier momento y contribuir con nuestra causa.  ¡Cualquier ayuda es importante!"
            href="/volunteers"
            title={<>Voluntariado</>}
            linkText="Ver más"
            background="pastel.green"
          />
        </Box>
      </div>
    </ClientLayout>
  )
}

export default Home
