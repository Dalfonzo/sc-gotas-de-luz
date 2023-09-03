import { Grid, GridItem, Text } from '@chakra-ui/react'

const Content = () => {
  return (
    <Grid
      templateColumns={{ base: 'repeat(1,1fr)', md: 'repeat(2,1fr)' }}
      templateRows={{ base: 'repeat(3,max-content)', md: 'repeat(2,1fr)' }}
      columnGap="1rem"
      as="section"
    >
      <GridItem padding="3rem">
        <Text as="h2" variant="subtitle-no-decoration">
          Misión
        </Text>
        <Text variant="normal" marginTop="2.5rem">
          Desarrollar iniciativas de asistencia social, promoviendo el voluntariado con el fin de mejorar la calidad de
          vida de la población, instituciones y centros de cuidados menos favorecidos.
        </Text>
      </GridItem>
      <GridItem gridRow={{ base: '2', md: 'span 2' }} padding="3rem" backgroundColor="pastel.green">
        <Text as="h2" variant="subtitle-no-decoration">
          Trayectoria
        </Text>
        <Text variant="normal" marginTop="2.5rem">
          Con más de cuatro años de experiencia, somos una fundación compuesta por más de 40 personas, que ha llevado a
          cabo grandes labores de ayuda humanitaria como la entrega de más de 6500 platos de comida en hospitales,
          institutos sociales, casas para niños en condiciones de abandono, para casas hogar de ancianos, para casas de
          adultos con condiciones especiales, para refugios de damnificados, para adultos en condiciones de abandono.
          Hemos hecho entrega de más de 2000 juguetes en actividades decembrinas y recreativas para niños; Así como se
          ha hecho entrega de útiles escolares, medicinas, utensilios de aseo personal, ropa, instrumentos para el
          deporte y otros artefactos para la mejoría de la calidad de vida de los más desfavorecidos.
        </Text>
      </GridItem>
      <GridItem padding="3rem">
        <Text as="h2" variant="subtitle-no-decoration">
          Visión
        </Text>
        <Text variant="normal" marginTop="2.5rem">
          Ser una fundación líder que potencia en los ciudadanos y en los más jóvenes, el servicio, la integridad, la
          cooperación, la empatía y el sentido de comunidad a través de la participación.
        </Text>
      </GridItem>
    </Grid>
  )
}

export default Content
