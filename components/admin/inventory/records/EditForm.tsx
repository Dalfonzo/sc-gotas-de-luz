import { Box, FormControl, FormErrorMessage, InputGroup, Textarea } from '@chakra-ui/react'
import { Button, Input, NumberInput, Stack, Switch, Text } from '@mantine/core'
import { Inventory, InventoryRecord } from '@prisma/client'
import { IconPlus } from '@tabler/icons-react'
import { format, formatISO } from 'date-fns'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { parseDate } from '~/lib/mappers/map-dates'
import { CreateInventory } from '~/prisma/types'
import { INVENTORY_RECORD_TYPES } from '~/utils/constants'

interface InventoryFormProps {
  inventory: Inventory
  onSuccess: () => void
  initialState: InventoryRecord
}
interface FormValues
  extends Omit<
    InventoryRecord,
    'id' | 'inventoryId' | 'type' | 'currentQuantity' | 'date' | 'expirationDate' | 'concept'
  > {
  canExpire: boolean
  date: string
  expirationDate: string | undefined
  concept: string
}
export default function InventoryEditForm({ inventory, onSuccess, initialState }: InventoryFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<FormValues>({
    initialValues: {
      date: format(initialState.date ? new Date(initialState.date) : new Date(), 'yyyy-MM-dd'),
      concept: initialState.concept || '',
      expirationDate: initialState.expirationDate ? format(new Date(initialState.expirationDate), 'yyyy-MM-dd') : '',
      canExpire: !!initialState.expirationDate,
      quantity: initialState.quantity,
    },
    validationSchema: Yup.object<CreateInventory>({
      date: Yup.string().required('La fecha es requerida'),
      concept: Yup.string().trim().required('El concepto es requerido'),
      expirationDate: Yup.string().test('exp test', function (value) {
        if (formik.values.canExpire && !value) {
          return this.createError({
            path: this.path,
            message: 'Ingresa la fecha de vencimiento',
          })
        }
        return true
      }),
    }),
    onSubmit: async (values) => {
      const parsed = {
        date: formatISO(parseDate(values.date)),
        concept: values.concept,
        expirationDate: null,
        ...(values.canExpire &&
          values.expirationDate && { expirationDate: formatISO(parseDate(values.expirationDate)) }),
      }
      await customFetcher.put(`/api/admin/inventory/${inventory.id}/record/${initialState.id}`, parsed)

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
    success: { message: 'Registro modificado' },
  })

  return (
    <Box>
      <Text size="md" variant="normal" mb="5">
        Puedes editar las fechas y concepto de un registro del <i>Inventario</i>.
      </Text>
      <form>
        <Stack spacing="xl" my="xl">
          <InputGroup justifyContent="space-between" alignItems="start">
            <FormControl isRequired isInvalid={Boolean(formik.errors.date && formik.touched.date)}>
              {' '}
              <Input.Wrapper label="Fecha de registro">
                <Input
                  mr="lg"
                  size="md"
                  type="date"
                  name="date"
                  onChange={formik.handleChange}
                  value={formik.values.date}
                />
              </Input.Wrapper>
              <FormErrorMessage>{formik.errors.date}</FormErrorMessage>
            </FormControl>
            <FormControl>
              {' '}
              <Input.Wrapper label={`Cantidad`}>
                <NumberInput
                  readOnly={true}
                  size="md"
                  rightSection={
                    <Text size="sm" color="dimmed">
                      {inventory.measure}
                    </Text>
                  }
                  rightSectionProps={{ style: { width: 'fit-content', marginRight: '1em' } }}
                  name="quantity"
                  onChange={(value) => formik.setFieldValue('quantity', value)}
                  value={formik.values.quantity}
                />
              </Input.Wrapper>
            </FormControl>
          </InputGroup>
          {initialState.type === INVENTORY_RECORD_TYPES.INPUT && (
            <InputGroup alignItems="center">
              <FormControl>
                <Switch
                  size="md"
                  name="canExpire"
                  checked={formik.values.canExpire}
                  onChange={formik.handleChange}
                  label="Registrar fecha de vencimiento"
                ></Switch>
              </FormControl>
              {formik.values.canExpire && (
                <FormControl
                  isRequired
                  isInvalid={Boolean(formik.errors.expirationDate && formik.touched.expirationDate)}
                >
                  {' '}
                  <Input.Wrapper label="Fecha de vencimiento">
                    <Input
                      size="md"
                      type="date"
                      name="expirationDate"
                      onChange={formik.handleChange}
                      value={formik.values.expirationDate}
                    />
                  </Input.Wrapper>
                  <FormErrorMessage>{formik.errors.expirationDate}</FormErrorMessage>
                </FormControl>
              )}
            </InputGroup>
          )}
          <FormControl isRequired isInvalid={Boolean(formik.errors.concept && formik.touched.concept)}>
            <Input.Wrapper label="Concepto">
              <Textarea
                placeholder="Explica el origen o razón de esta entrada"
                name="concept"
                onChange={formik.handleChange}
                value={formik.values.concept}
              />
            </Input.Wrapper>
            <FormErrorMessage>{formik.errors.concept}</FormErrorMessage>
          </FormControl>
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
          {'Editar'}
        </Button>
      </form>
    </Box>
  )
}
