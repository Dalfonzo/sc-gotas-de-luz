import { Box, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { Button } from '@mantine/core'
import { DonationSubscriber } from '@prisma/client'
import { IconPlus } from '@tabler/icons-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateSubscriber } from '~/prisma/types'

interface FormProps {
  initialState?: DonationSubscriber
  onSuccess: () => void
}

export default function SubscriberForm({ initialState, onSuccess }: FormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<CreateSubscriber>({
    initialValues: {
      name: initialState?.name || '',
      email: initialState?.email || '',
    },
    validationSchema: Yup.object<CreateSubscriber>({
      name: Yup.string().trim().required('El nombre es requerido'),
      email: Yup.string().trim().email('Ingresa un correo válido'),
    }),
    onSubmit: async (values) => {
      if (initialState) {
        await customFetcher.put(`/api/admin/donation/subscriber/${initialState.id}`, values)
      } else {
        await customFetcher.post('/api/admin/donation/subscriber', values)
      }
      onSuccess()
      return true
    },
    validateOnBlur: true,
  })

  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      const result = await formik.submitForm()
      return !!result
    },
    success: { message: 'Subscriptor añadido' },
  })

  return (
    <Box>
      <Text width="100%" fontSize="sm" variant="normal" mb="5">
        Llena los campos para agregar a un subscriptor de alertas de donativos.
      </Text>
      <form>
        <FormControl
          marginBottom="5"
          variant="floating"
          isRequired
          isInvalid={Boolean(formik.errors.name && formik.touched.name)}
        >
          <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl
          marginBottom="5"
          variant="floating"
          isRequired
          isInvalid={Boolean(formik.errors.email && formik.touched.email)}
        >
          <Input placeholder=" " name="email" onChange={formik.handleChange} value={formik.values.email} />
          <FormLabel htmlFor="name">Correo</FormLabel>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        <Button
          leftIcon={<IconPlus />}
          onClick={() => {
            onSubmit()
          }}
          loading={loadingSubmit}
          color="cyan"
          my="lg"
          size="lg"
          mr="auto"
        >
          {initialState ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </Box>
  )
}
