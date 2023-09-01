import { Box, Text } from '@chakra-ui/react'
import { List, ThemeIcon } from '@mantine/core'
import { IconHeartHandshake } from '@tabler/icons-react'
import { TextStyling } from '~/theme/components/text'
import { responsiveProperty } from '~/theme/utils'

const Heading = () => {
  return (
    <Box my={responsiveProperty({ desktopSize: 7, mobileSize: 2, unit: 'rem' })} as="section">
      <Text as="h1" variant="title" marginBottom="4rem" textAlign="center">
        Ayúdanos a ayudar
      </Text>
      <List
        spacing="sm"
        size="lg"
        styles={{ item: { ...TextStyling.variants.normal, fontWeight: 400, color: '#616161' } }}
        icon={
          <ThemeIcon color="cyan.4" radius="xl" size={24}>
            <IconHeartHandshake size="1rem" />
          </ThemeIcon>
        }
        px="1rem"
      >
        <List.Item>
          Donar a "Gotas de Luz" es una oportunidad maravillosa para marcar la diferencia en la vida de aquellos que más
          lo necesitan. Tu contribución puede ayudar a proporcionar alimentos, atención médica, educación y
          oportunidades de desarrollo a personas que de otra manera no tendrían acceso a ellos.
        </List.Item>
        <List.Item>
          Imagina el impacto positivo que puedes generar al donar. Cada gota de luz que aportas se convierte en una
          sonrisa en el rostro de un niño, en un abrazo reconfortante para un adulto mayor o en una mano extendida para
          alguien que atraviesa momentos difíciles. Tu generosidad puede cambiar vidas y brindar esperanza a aquellos
          que más lo necesitan.
        </List.Item>{' '}
        <List.Item>
          Recuerda que no importa cuán pequeña sea tu donación, cada aporte cuenta y suma. Juntos, podemos hacer una
          diferencia significativa en la vida de estas personas vulnerables y crear un mundo más solidario y compasivo.
        </List.Item>
      </List>
    </Box>
  )
}

export default Heading
