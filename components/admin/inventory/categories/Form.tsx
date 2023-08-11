import { Box, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { Button } from '@mantine/core'
import { Category } from '@prisma/client'
import { IconPlus } from '@tabler/icons-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateCategory } from '~/prisma/types'

interface CategoryFormProps {
  initialState?: Category
  onSuccess: () => void
}

export default function CategoryForm({ initialState, onSuccess }: CategoryFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<CreateCategory>({
    initialValues: {
      name: initialState?.name || '',
    },
    validationSchema: Yup.object<CreateCategory>({
      name: Yup.string().trim().required('El nombre es requerido'),
    }),
    onSubmit: async (values) => {
      if (initialState) {
        await customFetcher.put(`/api/admin/inventory/category/${initialState.id}`, values)
      } else {
        await customFetcher.post('/api/admin/inventory/category', values)
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
    success: { message: 'Noticia añadida' },
  })

  return (
    <Box>
      <Text width="100%" fontSize="sm" variant="normal" mb="5">
        Llena los campos para agregar esta categoría para el <i>Inventario</i>.
      </Text>
      <form>
        <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
          <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
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
