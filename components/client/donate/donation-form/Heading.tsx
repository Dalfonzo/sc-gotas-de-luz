import { Box, Button as ChakraButton, Text } from '@chakra-ui/react'
import { Card, Container, Transition } from '@mantine/core'
import { IconHeartHandshake } from '@tabler/icons-react'
import Link from 'next/link'
import { responsiveProperty } from '~/theme/utils'
import { DonateReducerActionKind, useDonate } from '../donate-context.provider'
import { DonationSteps } from './Steps'
import withAnimation from '~/hoc/withAnimation'

const DonationFormHeading = () => {
  const { state, updateFormToggle } = useDonate()
  return (
    <Container>
      <Box as="section" id="button" flex="flex" flexDir="column" px="1rem">
        <Text
          variant="subtitle-no-decoration"
          as="h2"
          mx="0"
          marginTop={responsiveProperty({ mobileSize: 2, desktopSize: 6, unit: 'rem' })}
          marginBottom="2rem"
        >
          ¡Aparece aquí!
        </Text>
        <Text variant="normal" my="2rem">
          Tu generosidad puede hacer una gran diferencia y ayudar a iluminar el camino de aquellos que más lo necesitan.
          ¡Juntos podemos hacer del mundo un lugar más brillante y lleno de esperanza! Si quieres que tu donativo sea
          mostrado aquí, haz{' '}
          <Link href="/donate#form">
            <Text
              as="span"
              cursor="pointer"
              onClick={() => updateFormToggle(DonateReducerActionKind.OPEN)}
              color="aqua.light"
              variant=""
            >
              click aquí
            </Text>
          </Link>{' '}
          o en el botón inferior y sigue las instrucciones para registrar tu donativo. ¡Gracias por apoyarnos!
        </Text>
        <ChakraButton
          leftIcon={<IconHeartHandshake />}
          size="lg"
          px="2em"
          display="flex"
          variant={state.formToggle ? 'ghost' : 'btn-primary'}
          marginX="auto"
          my="2em"
          width="12rem"
          id="form"
          onClick={() => updateFormToggle(DonateReducerActionKind.TOGGLE)}
        >
          Donar
        </ChakraButton>
      </Box>
      <Transition
        duration={500}
        exitDuration={500}
        mounted={state.formToggle}
        transition="scale-y"
        timingFunction="ease"
      >
        {(styles) => (
          <Card style={styles} shadow="lg">
            <DonationSteps afterComplete={() => updateFormToggle(DonateReducerActionKind.CLOSE)} />
          </Card>
        )}
      </Transition>
    </Container>
  )
}

export default withAnimation(DonationFormHeading)
