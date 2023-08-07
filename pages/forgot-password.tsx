import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { Button, Container, Paper, Text, Title } from '@mantine/core'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'

type ForgotPasswordProps = {
  email: string
}

function ForgotPassword() {
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const customFetcher = useFetcherInstance()

  const formik = useFormik<ForgotPasswordProps>({
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .trim()
        .required('Este campo es requerido')
        .min(3, 'El campo ingresado es muy corto')
        .email('Inserte un correo válido'),
    }),
    onSubmit: async (values: ForgotPasswordProps) => {
      await customFetcher.post('/api/forgot-password', values)
      return true
    },
    validateOnChange: false,
  })

  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      const result = await formik.submitForm()
      return !!result
    },
    success: { message: 'Correo enviado' },
  })

  return (
    <Container w="100%" h="100vh" fluid bg="cyan.4">
      <Container size={420} py={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          color="white"
        >
          Olvidé Contraseña
        </Title>
        <Paper p={30} mt={30} radius="md" withBorder shadow="md">
          <Text color="dimmed" align="center">
            Por favor, introduzca su correo.
            <br />
            Se le enviará un enlace para que pueda realizar el cambio de contraseña
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
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

            <Button
              fullWidth
              mt="xl"
              size="md"
              type="submit"
              loading={formik.isSubmitting || loadingSubmit}
              color="cyan.4"
            >
              Envíar correo
            </Button>
          </form>
        </Paper>
      </Container>
    </Container>
  )
}

export default ForgotPassword
