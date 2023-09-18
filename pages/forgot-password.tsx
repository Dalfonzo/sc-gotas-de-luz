import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { Button, Paper, Text } from '@mantine/core'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import AuthLayout from '~/layouts/Auth'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'

type ForgotPasswordProps = {
  email: string
}

function ForgotPassword() {
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
    <AuthLayout title="Olvidé Contraseña">
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
    </AuthLayout>
  )
}

export default ForgotPassword
