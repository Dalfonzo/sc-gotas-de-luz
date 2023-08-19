import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react'
import { Alert, Button, Container, Paper, Text, Title } from '@mantine/core'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import * as Yup from 'yup'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'

type ResetPasswordProps = {
  password: string
  passwordConfirmation: string
}

function ResetPassword() {
  const router = useRouter()
  const customFetcher = useFetcherInstance()
  const { id, token } = router.query
  const { fetcher } = useFetcher<{ message: string; status: string }>()
  const { data, isLoading } = useSWR<{ message: string; status: string }>(
    () => {
      if (!id || !token) return null
      return [`/api/reset-password/${id}/${token}`]
    },
    ([url, dto]: useFetcherParams<{ message: string }>) => fetcher(url, dto),
    {
      revalidateOnFocus: false,
    }
  )
  const isFreshAccount = !!router.query.firstTime
  const isInvalid = data?.status === 'error'

  const formik = useFormik<ResetPasswordProps>({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().trim().required('Este campo es requerido').min(3, 'El campo ingresado es muy corto'),
      passwordConfirmation: Yup.string()
        .trim()
        .required('Este campo es requerido')
        .min(3, 'El campo ingresado es muy corto')
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir'),
    }),
    onSubmit: async (values: ResetPasswordProps) => {
      await customFetcher.post(`/api/reset-password/${id}/${token}`, { password: values.password })
      router.replace('/sign-in')
      return true
    },
    validateOnChange: false,
  })

  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      const result = await formik.submitForm()
      return !!result
    },
    success: { message: 'Contraseña cambiada exitosamente' },
  })

  return (
    <Container w="100%" h="100vh" fluid bg="cyan.4">
      <Container size={420} py={40}>
        <Title
          align="center"
          sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}
          color="white"
        >
          {isFreshAccount ? '¡Bienvenido a bordo!' : 'Cambiar Contraseña'}
        </Title>
        {isInvalid && (
          <Alert color="red" title="Error" my="md" variant="filled">
            {data?.message}
          </Alert>
        )}
        <Paper p={30} mt={30} radius="md" withBorder shadow="md">
          <Text color="dimmed" align="center">
            {isFreshAccount
              ? 'Por favor, indique la contraseña con la que desea ingresar a su cuenta'
              : 'Por favor, introduzca su nueva contraseña'}
          </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              onSubmit()
            }}
          >
            <FormControl variant="floating" isInvalid={Boolean(formik.errors.password)} my="1rem">
              <Input
                placeholder=" "
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                type="password"
                disabled={isInvalid}
              />
              <FormLabel htmlFor="password">Contraseña</FormLabel>
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl variant="floating" isInvalid={Boolean(formik.errors.passwordConfirmation)} my="1rem">
              <Input
                placeholder=" "
                name="passwordConfirmation"
                onChange={formik.handleChange}
                value={formik.values.passwordConfirmation}
                type="password"
                disabled={isInvalid}
              />
              <FormLabel htmlFor="passwordConfirmation">Confirmación de contraseña</FormLabel>
              <FormErrorMessage>{formik.errors.passwordConfirmation}</FormErrorMessage>
            </FormControl>
            <Button
              fullWidth
              mt="xl"
              size="md"
              type="submit"
              loading={formik.isSubmitting || loadingSubmit}
              color="cyan.4"
              disabled={isInvalid}
            >
              {isFreshAccount ? 'Registrar contraseña' : 'Cambiar contraseña'}
            </Button>
          </form>
        </Paper>
      </Container>
    </Container>
  )
}

export default ResetPassword
