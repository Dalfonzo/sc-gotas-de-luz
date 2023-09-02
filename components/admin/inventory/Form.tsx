import { Box, FormControl, FormErrorMessage, InputGroup, Text } from '@chakra-ui/react'
import { Autocomplete, Button, Input, MediaQuery, Stack } from '@mantine/core'
import { Inventory } from '@prisma/client'
import { IconPlus } from '@tabler/icons-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateInventory } from '~/prisma/types'
import { responsiveProperty } from '~/theme/utils'
import { CategoriesSelect } from './categories/Select'

interface InventoryFormProps {
  initialState?: Inventory
  onSuccess: () => void
}

export default function InventoryForm({ initialState, onSuccess }: InventoryFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<CreateInventory>({
    initialValues: {
      name: initialState?.name || '',
      categoryId: String(initialState?.categoryId) || '',
      measure: initialState?.measure || '',
    },
    validationSchema: Yup.object<CreateInventory>({
      name: Yup.string().trim().required('El nombre es requerido'),
    }),
    onSubmit: async (values) => {
      const parsed = {
        ...values,
        categoryId: Number(values.categoryId),
      }
      if (initialState) {
        await customFetcher.put(`/api/admin/inventory/${initialState.id}`, parsed)
      } else {
        await customFetcher.post('/api/admin/inventory', parsed)
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
        Llena los campos para agregar este elemento al <i>Inventario</i>.
      </Text>
      <form>
        <Stack spacing="xl" my="xl">
          <FormControl isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
            <Input.Wrapper label="Nombre" description="Para identificar este elemento">
              <Input
                size="md"
                placeholder="Ingresa un nombre"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </Input.Wrapper>
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <MediaQuery smallerThan="sm" styles={{ flexWrap: 'wrap' }}>
            <InputGroup alignItems="end" justifyContent="space-between">
              <FormControl
                w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
                isRequired
                isInvalid={Boolean(formik.errors.measure && formik.touched.measure)}
              >
                <Autocomplete
                  mb="md"
                  miw="45%"
                  dropdownPosition="top"
                  placeholder="Ingresa una medida"
                  size="md"
                  data={['Unidades', 'Gramos', 'Kilogramos', 'ml', 'Litros', 'cm', 'Metros', 'Toneladas']}
                  name="measure"
                  description="Cómo se mide este inventario"
                  onChange={(value) => formik.setFieldValue('measure', value)}
                  value={formik.values.measure}
                  label="Unidad"
                />
                <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
              </FormControl>
              <FormControl
                w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
                isRequired
                isInvalid={Boolean(formik.errors.categoryId && formik.touched.categoryId)}
              >
                <CategoriesSelect
                  mb="md"
                  placeholder="Selecciona una categoría"
                  size="md"
                  dropdownPosition="top"
                  description="Agrupa por tipo de elemento"
                  label="Categoría"
                  name="categoryId"
                  setSelectedCategory={(value: string | null) => formik.setFieldValue('categoryId', value)}
                  selectedCategory={formik.values.categoryId}
                />
                <FormErrorMessage>{formik.errors.categoryId}</FormErrorMessage>
              </FormControl>
            </InputGroup>
          </MediaQuery>
        </Stack>
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
