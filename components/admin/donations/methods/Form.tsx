import { AddIcon } from '@chakra-ui/icons'
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { List } from '@mantine/core'
import { DonationMethod } from '@prisma/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import TextEditor from '~/components/common/text-editor/TextEditor'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'

interface MethodFormProps {
  initialState?: DonationMethod
  onSuccess: () => void
}

interface CreateValues extends Omit<DonationMethod, 'id'> {}

const BASE_REFERENCE = `<p><strong>Banco</strong>:</p><p><strong>Número telefónico</strong>:</p><p><strong>Cédula</strong>:</p>`

export default function MethodsForm({ initialState, onSuccess }: MethodFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<CreateValues>({
    initialValues: {
      name: '',
      reference: BASE_REFERENCE,
      ...initialState,
    },
    validationSchema: Yup.object<CreateValues>({
      name: Yup.string().trim().required('El nombre es requerido'),
      reference: Yup.string()
        .trim()
        .required('Los datos para realizar el pago son requeridos')
        .test('complete test', function (value) {
          if (value === BASE_REFERENCE) {
            return this.createError({
              path: this.path,
              message: 'Por favor, indica los datos para recibir pagos',
            })
          }
          return true
        }),
    }),
    onSubmit: async (values) => {
      if (initialState) {
        await customFetcher.put(`/api/admin/donation/method/${initialState.id}`, values)
      } else {
        await customFetcher.post('/api/admin/donation/method', values)
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
    success: { message: 'Método añadido' },
  })

  return (
    <Box>
      <Text variant="normal" size="sm" mt="">
        Llena los campos para registrar un método de pago con el cual se puedan recibir donaciones.
      </Text>
      <form>
        <Flex wrap="wrap" alignItems="normal" my="">
          <Flex gap={6} flexDirection="column" maxWidth="95%" mx="auto" mt="1.5em">
            <FormControl variant="" isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
              <FormLabel htmlFor="name">Nombre</FormLabel>

              <Input
                placeholder="Ej: Pago móvil - Nombre del Banco"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl variant="" isRequired isInvalid={Boolean(formik.errors.reference && formik.touched.reference)}>
              {' '}
              <FormLabel htmlFor="reference">Datos </FormLabel>
              <List size="sm" mb="sm">
                <List.Item>Indica los datos necesarios para poder recibir un pago</List.Item>
                <List.Item>
                  Puedes modificar este campo para colocar toda la información necesaria para este método de pago.
                </List.Item>
              </List>
              <TextEditor
                value={formik.values.reference}
                onChange={(value) => formik.setFieldValue('reference', value)}
              />
              <FormErrorMessage>{formik.errors.reference}</FormErrorMessage>
            </FormControl>

            <Flex my="2rem" gap="5">
              <Button
                leftIcon={<AddIcon />}
                isLoading={loadingSubmit}
                onClick={() => onSubmit()}
                variant="btn-primary"
                width="12rem"
                size="sm"
              >
                {initialState ? 'Actualizar' : 'Añadir'}
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
    </Box>
  )
}
