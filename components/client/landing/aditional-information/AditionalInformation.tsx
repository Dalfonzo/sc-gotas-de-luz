import { Flex } from '@chakra-ui/react'
import InfoCard from './InfoCard'

const AditionalInformation = () => {
  return (
    <Flex maxW="7xl" mx="auto" flexDir={{ base: 'column', md: 'row' }}>
      <InfoCard
        title="Voluntariado"
        content="No es necesario contar con mucho para ayudar a alguien más. Puedes postularte como voluntario en cualquier momento y contribuir con nuestra causa.  ¡Cualquier ayuda es importante!"
        link="/volunteers"
      />
      <InfoCard
        title="Próximos Eventos"
        content="Siempre estamos haciendo actividades en diversas partes del país. Puedes ver nuestro calendario y mantenerte al tanto de nuestras fechas y demás detalles."
        link="/events"
      />
    </Flex>
  )
}

export default AditionalInformation
