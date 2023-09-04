import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { Button, Checkbox } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { Resources } from '~/ts/Resources'
import { Roles } from '~/ts/Roles'

interface FormProps {
  onSuccess: () => void
  resources: Resources[]
  initialState: Roles | undefined
  readOnly: boolean
}

type InitialValues = {
  [name: string]: string[] | string
  // name: string
}
const EXCLUDED_VALUES = ['name', 'description']

const totalOfSelectedItems = (values: Record<string, string[] | string>) => {
  let total = 0
  Object.keys(values).forEach((resource) => (total += EXCLUDED_VALUES.includes(resource) ? 0 : values[resource].length))
  return total
}

export default function RoleForm({ onSuccess, resources, initialState, readOnly }: FormProps) {
  const customFetcher = useFetcherInstance()

  const initial = initialState?.permissions.reduce((prev, curr) => {
    let permissionsArr = []

    if (curr.create) permissionsArr.push('CREATE')
    if (curr.update) permissionsArr.push('UPDATE')
    if (curr.delete) permissionsArr.push('DELETE')
    if (curr.read) permissionsArr.push('READ')

    prev[curr.resources.name] = permissionsArr

    return prev
  }, {} as InitialValues)

  const formik = useFormik<InitialValues>({
    initialValues: initialState
      ? ({ name: initialState.name, description: initialState.description || '', ...initial } as InitialValues)
      : {
          name: '',
          description: '',
          ...resources.reduce((prev, curr) => {
            prev[curr.name] = []
            return prev
          }, {} as InitialValues),
        },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('El nombre del rol es requerido').max(20, 'Máximo 20 caracteres'),
    }),
    onSubmit: async (values) => {
      const parsedPermissions = Object.keys(values)
        .filter((permission) => !EXCLUDED_VALUES.includes(permission))
        .map((permission) => {
          return {
            create: values[permission].includes('CREATE'),
            delete: values[permission].includes('DELETE'),
            update: values[permission].includes('UPDATE'),
            read: values[permission].includes('READ'),
            resourceId: resources.find((res) => res.name === permission)?.id,
          }
        })
      const data = { name: values.name, permissions: parsedPermissions, description: values.description }
      if (initialState) {
        await customFetcher.put(`/api/admin/roles/${initialState.id}`, data)
      } else {
        await customFetcher.post('/api/admin/roles', data)
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
    success: { message: initialState ? 'Rol actualizado' : 'Rol añadido' },
  })

  return (
    <Box>
      <Text width="100%" fontSize="sm" variant="normal" mb="5">
        Llena los campos para agregar este rol.
      </Text>
      <form>
        <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name)}>
          <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
          <FormLabel htmlFor="name">Nombre del rol</FormLabel>
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={Boolean(formik.errors.description)} my="1rem">
          <Input placeholder=" " name="description" onChange={formik.handleChange} value={formik.values.description} />
          <FormLabel htmlFor="description">Descripción del rol</FormLabel>
          <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
        </FormControl>
        <Flex gap={6} flexDirection="column" maxWidth="95%" mx="auto" alignItems="flex-start" mt="1rem">
          <Flex width="100%">
            <Text fontWeight="bold">Recursos</Text>
            <Text fontWeight="bold" ml="10rem">
              Permisos
            </Text>
          </Flex>
          {resources.map((resource, i) => {
            return (
              <Flex gap={6} key={i} width="100%">
                <Text mr="auto">{resource.name.charAt(0).toUpperCase() + resource.name.slice(1).toLowerCase()}</Text>
                <Checkbox
                  name={resource.name}
                  value="CREATE"
                  onChange={formik.handleChange}
                  defaultChecked={formik.initialValues[resource.name].includes('CREATE')}
                  label={'Crear'}
                  color="cyan"
                  disabled={readOnly}
                />
                <Checkbox
                  name={resource.name}
                  value="UPDATE"
                  onChange={formik.handleChange}
                  defaultChecked={formik.initialValues[resource.name].includes('UPDATE')}
                  label={'Modificar'}
                  color="cyan"
                  disabled={readOnly}
                />
                <Checkbox
                  name={resource.name}
                  value="READ"
                  defaultChecked={formik.initialValues[resource.name].includes('READ')}
                  onChange={formik.handleChange}
                  label={'Leer'}
                  color="cyan"
                  disabled={readOnly}
                />
                <Checkbox
                  name={resource.name}
                  value="DELETE"
                  onChange={formik.handleChange}
                  defaultChecked={formik.initialValues[resource.name].includes('DELETE')}
                  label={'Borrar'}
                  color="cyan"
                  disabled={readOnly}
                />
              </Flex>
            )
          })}
          <Button
            leftIcon={<IconPlus />}
            onClick={() => {
              onSubmit()
            }}
            disabled={totalOfSelectedItems(formik.values) === 0 || !!formik.errors.name || !formik.dirty}
            loading={loadingSubmit}
            color="cyan"
            mb="lg"
            size="lg"
            mr="auto"
          >
            {initialState ? 'Actualizar' : 'Agregar'}
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
