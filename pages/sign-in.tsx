import { Alert, Button, Container, Paper, PasswordInput, Text, TextInput, Title } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'

type LoginForm = {
  email: string
  password: string
}

function SignIn() {
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const form = useForm<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: yupResolver(
      Yup.object({
        email: Yup.string()
          .trim()
          .required('Este campo es requerido')
          .min(3, 'El campo ingresado es muy corto')
          .email('Inserte un correo válido'),
        password: Yup.string().trim().required('Este campo es requerido').min(3, 'El campo ingresado es muy corto'),
      })
    ),
  })

  const onSubmit = async (values: LoginForm) => {
    setError(null)
    setIsLoading(true)
    signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    })
      .then((res) => {
        if (res?.ok) {
          router.push('/admin/dashboard')
        } else {
          setError('Usuario o contraseña incorrectos. Por favor, intente de nuevo.')
          setIsLoading(false)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  return (
    <Container w="100%" h="100vh" fluid bg="cyan.4">
      <Container size={420} py={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          color="white"
        >
          Bienvenido
        </Title>
        <Paper p={30} mt={30} radius="md" withBorder shadow="md">
          <form onSubmit={form.onSubmit(onSubmit)}>
            <TextInput
              label="Correo"
              placeholder="Ingresa tu correo"
              size="md"
              {...form.getInputProps('email')}
              readOnly={isLoading}
              type="email"
            />
            <PasswordInput
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              mt="md"
              size="md"
              {...form.getInputProps('password')}
              readOnly={isLoading}
            />
            {error && (
              <Alert color="red" my="lg">
                <Text color="red">{error}</Text>
              </Alert>
            )}
            <Button fullWidth mt="xl" size="md" type="submit" loading={isLoading} color="cyan.4">
              Iniciar sesión
            </Button>
          </form>
        </Paper>
      </Container>
    </Container>
  )
}

export default SignIn
