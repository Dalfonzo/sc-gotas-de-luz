import { FormControl, FormErrorMessage, FormLabel, Image, Input } from '@chakra-ui/react'
import { Alert, Button, Container, Paper, Text, Title } from '@mantine/core'
import { useFormik } from 'formik'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'
import Captcha, { useCaptcha } from '~/components/common/captcha/Captcha'
type LoginForm = {
  email: string
  password: string
}

function SignIn() {
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { loadingCaptcha, executeCaptcha, ...captchaRest } = useCaptcha()
  const onSignIn = (values: LoginForm) => {
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
  const formik = useFormik<LoginForm>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required('Este campo es requerido')
        .min(3, 'El campo ingresado es muy corto')
        .email('Inserte un correo válido'),
      password: Yup.string().trim().required('Este campo es requerido').min(3, 'El campo ingresado es muy corto'),
    }),
    onSubmit: async (values: LoginForm) => {
      executeCaptcha(() => onSignIn(values))
    },
    validateOnChange: false,
  })

  return (
    <Container w="100%" h="100vh" fluid bg="cyan.4">
      <Captcha callback={async () => onSignIn(formik.values)} {...captchaRest} />
      <Container size={420} py={40}>
        <Image src="/assets/svg/logo-footer.svg" alt="asd" width={75} height={75} mx="auto" mt="4" mb="5" />
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          color="white"
        >
          Iniciar sesión
        </Title>
        <Paper p={30} mt={30} radius="md" withBorder shadow="md">
          <Text color="dimmed" align="center">
            Por favor, introduzca sus credenciales
          </Text>
          <form onSubmit={formik.handleSubmit}>
            <FormControl variant="floating" isInvalid={Boolean(formik.errors.email)} my="1rem">
              <Input
                placeholder=" "
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
              />
              <FormLabel htmlFor="email">Correo</FormLabel>
              <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl variant="floating" isInvalid={Boolean(formik.errors.password)} my="1rem">
              <Input
                placeholder=" "
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                type="password"
              />
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            {error && (
              <Alert color="red" my="lg">
                <Text color="red">{error}</Text>
              </Alert>
            )}

            <Button fullWidth mt="xl" size="md" type="submit" loading={isLoading || loadingCaptcha} color="cyan.4">
              Iniciar sesión
            </Button>
          </form>
          <Text component={Link} href="/forgot-password" color="blue" align="right" display="block" mt="lg">
            ¿Olvidó su contraseña?
          </Text>
        </Paper>
      </Container>
    </Container>
  )
}

export default SignIn
