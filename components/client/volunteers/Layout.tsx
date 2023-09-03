import { Flex, Link, Text } from '@chakra-ui/react'
import { useScrollIntoView } from '@mantine/hooks'
import NextLink from 'next/link'
import { BsEmojiLaughing, BsHeart, BsHeartPulse, BsLightbulb, BsPeople } from 'react-icons/bs'
import { LINKS } from '~/utils/constants'
import LinkButton from '../common/link-button/LinkButton'
import { InfoCard, InfoCardProps } from './Card'
import VHeading from './Heading'
const cards: InfoCardProps[] = [
  {
    title: 'Haz la diferencia',
    content:
      'Participar como voluntario es una gran manera de hacer un impacto positivo en la vida de las personas menos favorecidas. Al dedicar tu tiempo y energía, puedes ayudar a mejorar las vidas de los otros y hacer una diferencia real en tu comunidad.',
    icon: BsHeart,
  },
  {
    title: 'Adquiere nuevas habilidades',
    content:
      'Los voluntariados pueden ser una gran forma de aprender nuevas habilidades y ganar experiencia valiosa. Gotas de Luz posee una variedad de oportunidades de voluntariado para ayudarte a desarrollar nuevas habilidades y mejorar tu perfil.',
    icon: BsLightbulb,
  },
  {
    title: 'Conoce nuevas personas',
    content:
      'Participar en voluntariados en un medio genial para conocer nuevas personas y hacer nuevas amistades. Al colaborar junto con otros voluntarios pueden compartir su pasión de ayudar a otros, puedes formar amistades significativas y desarrollar un sentido comunitario',
    icon: BsPeople,
  },
  {
    title: 'Diviértete',
    content:
      'Ya sea al participar en actividades con mayores o infantes;  jornadas de recolección y salud; entrega de juguetes, alimentos, medicamentos... Ser un voluntario en Gotas de Luz puede ser una experiencia divertida y gratificante.',
    icon: BsEmojiLaughing,
  },
  {
    title: 'Mejora tu salud mental',
    content: (
      <span>
        Se ha{' '}
        <span>
          <Link
            as={NextLink}
            color="teal.500"
            href="https://www.laverdad.es/salud/psicologia/20130823/voluntarios-salud-mental-longevos-201308231104-rc.html"
            target="_blank"
          >
            demostrado
          </Link>
        </span>{' '}
        que participar en voluntariados tiene un impacto positivo en la salud mental. Al ayudar a otros, puedes despejar
        tu estado de ánimo, reducir el estrés y mejorar tu bienestar general.
      </span>
    ),
    icon: BsHeartPulse,
  },
]
export const VolunteersLayout = () => {
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLParagraphElement>({ offset: 80 })
  const formLink = LINKS.VOLUNTEER_FORM
  return (
    <Flex direction="column" align="center" maxW="5xl" margin="auto" px="5">
      <VHeading onScroll={scrollIntoView} />
      <Flex justify="center" wrap="wrap" width="100%" gap="5" /*columns={{ xs: 3, sm: 2, md: 3 }}*/>
        {cards.map((card, idx) => (
          <InfoCard key={idx} {...card} />
        ))}
      </Flex>
      <Flex direction="column" mt="5em">
        <Text variant="subtitle-no-decoration" mb="5" as="h2" ref={targetRef}>
          ¿Listo para el primer paso?
        </Text>
        <Text>Ingresa en el siguiente link para registrar tus datos y formar parte de nuestro gran equipo:</Text>
        <LinkButton
          href={formLink}
          target="_blank"
          variant="lnk-btn-black"
          content="Registro de voluntarios"
          marginTop="4rem"
          mx="auto"
          position="relative"
          display="block"
          width="fit-content"
          withArrow={true}
        />
      </Flex>
    </Flex>
  )
}
