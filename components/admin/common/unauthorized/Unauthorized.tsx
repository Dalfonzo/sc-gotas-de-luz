import { Button, Container, Group, Text, Title, createStyles, rem } from '@mantine/core'
import Link from 'next/link'

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: rem(80),
    paddingBottom: rem(80),
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(120),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: rem(38),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(32),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
  },
}))

export function Unauthorized() {
  const { classes } = useStyles()

  return (
    <Container className={classes.root}>
      <div className={classes.label}>401</div>
      <Title className={classes.title}>No tienes autorización</Title>
      <Text color="dimmed" size="lg" align="center" className={classes.description}>
        Desafortunadamente, no puedes ver el contenido de esta página debido a falta de permisos. Por favor, contacta a
        los administradores para mayor asistencia.
      </Text>
      <Group position="center">
        <Button variant="subtle" size="md" component={Link} href="/admin/dashboard">
          Volver al inicio
        </Button>
      </Group>
    </Container>
  )
}
