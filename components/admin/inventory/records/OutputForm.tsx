import { Box, FormControl, FormErrorMessage, InputGroup, Textarea } from '@chakra-ui/react'
import { ActionIcon, Button, Divider, Grid, Group, Input, NumberInput, Select, Stack, Text } from '@mantine/core'
import { Inventory, InventoryRecord } from '@prisma/client'
import { IconPlus, IconTransferOut, IconTrash } from '@tabler/icons-react'
import { format, formatISO } from 'date-fns'
import { useFormik } from 'formik'
import { forwardRef, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import * as Yup from 'yup'
import { useFetcher, useFetcherParams } from '~/hooks/fetcher'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { formatDate, parseDate } from '~/lib/mappers/map-dates'
import { CreateInventory } from '~/prisma/types'
import { INVENTORY_RECORD_TYPES } from '~/utils/constants'

interface InventoryFormProps {
  inventory: Inventory
  onSuccess: () => void
  initialOutputId?: string
}

interface Output {
  id: string
  value: string
  quantity: number
  maxQuantity?: number
}

interface FormValues
  extends Omit<
    InventoryRecord,
    'id' | 'inventoryId' | 'type' | 'currentQuantity' | 'date' | 'expirationDate' | 'concept' | 'quantity'
  > {
  date: string
  concept: string
  outputs: Output[]
}

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  expirationDate?: string
  date: string
  quantity: number
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(function SelectItem(
  { date, expirationDate, quantity, ...others }: ItemProps,
  ref
) {
  return (
    <div ref={ref} {...others}>
      <div>
        <Text size="sm">Del: {date}</Text>
        <Group>
          <Text size="xs" opacity={0.65}>
            Cantidad restante: <b>{quantity}</b>
          </Text>
          <Text size="xs" opacity={0.65}>
            Vence el: <b>{expirationDate}</b>
          </Text>
        </Group>
      </div>
    </div>
  )
})

const OutputSelect = ({
  outputs,
  records,
  onChange,
  value,
  index,
}: Pick<OutputProps, 'onChange' | 'outputs'> & { records?: InventoryRecord[]; value: string; index: number }) => {
  const selectableRecords = useMemo(() => {
    const processed =
      records
        ?.filter((rec) => !outputs.find((out) => out.id !== value && out.id === rec.id))
        .map((rec) => ({
          ...rec,
          date: formatDate(rec.date, { altFormat: `dd 'de' MMMM yyyy` }),
          expirationDate: rec.expirationDate
            ? formatDate(rec.expirationDate, { altFormat: `dd 'de' MMMM yyyy` })
            : 'Sin fecha',
        })) || []
    return processed
  }, [outputs, records, value])
  return (
    <Select
      label="Entrada a despachar"
      width="70%"
      itemComponent={SelectItem}
      data={selectableRecords.map((rec) => ({
        expirationDate: rec.expirationDate,
        quantity: rec.currentQuantity,
        date: rec.date,
        value: rec.id,
        label: `${`${rec.date} (${rec.currentQuantity} uds restantes)`}`,
      }))}
      nothingFound={'Sin entradas que despachar'}
      onChange={(value) => {
        onChange({
          index,
          ...(value && {
            value: value,
            id: value,
            maxQuantity: records?.find((rec) => rec.id === value)?.currentQuantity,
          }),
        })
      }}
      value={value}
    ></Select>
  )
}

interface OutputProps {
  inventory: Inventory
  outputs: Output[]
  onChange: (value: { index: number } & Partial<Output>) => void
  onDelete: (idx: number) => void
}

const OutputHandler = ({ inventory, outputs, onChange, onDelete }: OutputProps) => {
  const { fetcher } = useFetcher<InventoryRecord[]>()
  const {
    data: records,
    error: recordError,
    isLoading: loadingRecords,
  } = useSWR<InventoryRecord[]>(
    [
      `/api/admin/inventory/${inventory.id}/record`,
      {
        usePagination: false,
        query: {
          sortBy: 'expirationDate',
          remaining: 1,
        },
      },
    ],
    ([url, dto]: useFetcherParams<InventoryRecord[]>) => fetcher(url, dto)
  )

  return (
    <Stack my="md">
      {outputs.map((out, index) => (
        <Grid align="center" key={index}>
          <Grid.Col span={7}>
            <OutputSelect records={records} outputs={outputs} onChange={onChange} index={index} value={out.value} />
          </Grid.Col>
          <Grid.Col span={4}>
            <NumberInput
              label="Cantidad a despachar"
              value={outputs[index].quantity}
              max={outputs[index].maxQuantity}
              onChange={(value) => {
                typeof value == 'number' && onChange({ index, quantity: value })
              }}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <ActionIcon onClick={() => onDelete(index)} variant="light">
              <IconTrash />
            </ActionIcon>
          </Grid.Col>
        </Grid>
      ))}
    </Stack>
  )
}

export default function InventoryOutputForm({ inventory, onSuccess, initialOutputId }: InventoryFormProps) {
  const customFetcher = useFetcherInstance()

  const INITIAL_OUTPUT: Output = { id: '', quantity: 0, value: '' }
  useEffect(() => {
    if (initialOutputId) {
      formik.setFieldValue(
        'outputs',
        formik.values.outputs.map((v, i) => {
          if (i === 0) {
            v = { ...v, id: initialOutputId, value: initialOutputId }
            return v
          }
          return v
        })
      )
    }
  }, [])
  const formik = useFormik<FormValues>({
    initialValues: {
      outputs: [INITIAL_OUTPUT],
      date: format(new Date(), 'yyyy-MM-dd'),
      concept: '',
    },
    validationSchema: Yup.object<CreateInventory>({
      date: Yup.string().required('La fecha de ingreso es requerida'),
      concept: Yup.string().trim().required('El concepto de la salida es requerida'),
      outputs: Yup.array()
        .min(1, 'Selecciona al menos una entrada')
        .test('output test', function (value) {
          if (!value) {
            return this.createError({
              path: this.path,
              message: 'Selecciona al menos una entrada',
            })
          }
          for (let output of value) {
            if (!output.quantity) {
              return this.createError({
                path: this.path,
                message: 'Completa la cantidad de todas las salidas',
              })
            }
            if (!output.id?.length) {
              return this.createError({
                path: this.path,
                message: 'Selecciona el origen de todas las salidas',
              })
            }
          }
          return true
        }),
    }),
    onSubmit: async (values) => {
      const parsed = {
        date: formatISO(parseDate(values.date)),
        concept: values.concept,
        outputs: values.outputs,
        type: INVENTORY_RECORD_TYPES.OUTPUT,
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
              <Input.Wrapper label="Fecha de egreso">
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
          </InputGroup>
          <FormControl isRequired isInvalid={Boolean(formik.errors.outputs && formik.touched.outputs)}>
            <Divider mt="md" mb="xl" />
            <Input.Wrapper label="Origen de egresos">
              <Text>Selecciona las entradas que van a ser despachadas:</Text>
              <Button
                display="block"
                onClick={() => {
                  const outputs = formik.values.outputs
                  outputs.push(INITIAL_OUTPUT)
                  formik.setFieldValue('outputs', outputs)
                }}
                leftIcon={<IconTransferOut size={'1.25rem'} />}
                variant="outline"
                ml="auto"
                mr="md"
              >
                Despachar otra entrada
              </Button>
              <OutputHandler
                inventory={inventory}
                outputs={formik.values.outputs}
                onChange={(value) => {
                  const mapped = formik.values.outputs.map((v, index) => {
                    if (index === value.index) return { ...v, ...value }
                    return v
                  })
                  formik.setFieldValue('outputs', [...mapped])
                }}
                onDelete={(index) => {
                  if (formik.values.outputs.length > 1) {
                    const filtered = formik.values.outputs.filter((v, idx) => index !== idx)
                    formik.setFieldValue('outputs', [...filtered])
                  }
                }}
              />
              <FormErrorMessage>
                {String(Array.isArray(formik.errors.outputs) ? formik.errors.outputs.at(0) : formik.errors.outputs)}
              </FormErrorMessage>
              <Text>
                Total a despachar:{' '}
                <b>{formik.values.outputs.reduce<number>((prev, current) => prev + current.quantity, 0)} unidades</b>
              </Text>
            </Input.Wrapper>
            <Divider mb="md" mt="xl" />
          </FormControl>
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
