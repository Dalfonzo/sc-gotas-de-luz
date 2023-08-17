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
export default function InventoryInputForm({ inventory, onSuccess }: InventoryFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<FormValues>({
    initialValues: {
      quantity: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      concept: '',
      expirationDate: '',
      canExpire: false,
    },
    validationSchema: Yup.object<CreateInventory>({
      quantity: Yup.number()
        .positive('La cantidad debe ser positiva')
        .moreThan(0, 'La cantidad debe ser más de 0')
        .required('La cantidad es requerida'),
      date: Yup.string().required('La fecha de ingreso es requerida'),
      concept: Yup.string().trim().required('El concepto de la entrada es requerido'),
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
        quantity: values.quantity,
        date: formatISO(parseDate(values.date)),
        concept: values.concept,
        ...(values.canExpire &&
          values.expirationDate && { expirationDate: formatISO(parseDate(values.expirationDate)) }),
        type: INVENTORY_RECORD_TYPES.INPUT,
      }
      await customFetcher.post(`/api/admin/inventory/${inventory.id}/record`, parsed)

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
    success: { message: 'Registro añadido' },
  })

  return (
    <Box>
      <Text size="md" variant="normal" mb="5">
        Llena los campos para registrar en el histórico de <i>{inventory.name}</i>.
      </Text>
      <form>
        <Stack spacing="xl" my="xl">
          <InputGroup justifyContent="space-between" alignItems="start">
            <FormControl isRequired isInvalid={Boolean(formik.errors.date && formik.touched.date)}>
              {' '}
              <Input.Wrapper label="Fecha de ingreso">
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
            <FormControl isRequired isInvalid={Boolean(formik.errors.quantity && formik.touched.quantity)}>
              {' '}
              <Input.Wrapper label={`Cantidad a ingresar`}>
                <NumberInput
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
              <FormErrorMessage>{formik.errors.quantity}</FormErrorMessage>
            </FormControl>
          </InputGroup>
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
          {'Agregar'}
        </Button>
      </form>
    </Box>
  )
}
