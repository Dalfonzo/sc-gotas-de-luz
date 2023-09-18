import {
  AbsoluteCenter,
  Box,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  Text,
} from '@chakra-ui/react'
import { Button } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { Roles } from '~/ts/Roles'
import { User } from '~/ts/User'

interface Props {
  onSuccess: () => void
  roles: Roles[] | undefined
  initialState: User | undefined
}

type InitialValues = {
  name: string
  lastName: string
  email: string
  password?: string
  fkRole: string
  canBeDeleted: boolean
}

export default function Form({ onSuccess, roles, initialState }: Props) {
  const customFetcher = useFetcherInstance()
  const formik = useFormik<InitialValues>({
    initialValues: {
      name: initialState?.name || '',
      lastName: initialState?.lastName || '',
      email: initialState?.email || '',
      fkRole: initialState?.fkRole || '',
      canBeDeleted: initialState?.canBeDeleted ?? true,
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('El nombre es requerido').max(100, 'Máximo 100 caracteres'),
      lastName: Yup.string().trim().required('El apellido es requerido').max(100, 'Máximo 100 caracteres'),
      email: Yup.string()
        .trim()
        .required('El correo es requerido')
        .max(200, 'Máximo 200 caracteres')
        .email('Inserte un correo válido'),
      fkRole: Yup.string().trim().required('El nombre del rol es requerido'),
    }),
    onSubmit: async (values) => {
      if (initialState) {
        await customFetcher.put(`/api/admin/users/${initialState.id}`, values)
      } else {
        await customFetcher.post('/api/admin/users', values)
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
    success: { message: initialState ? 'Usuario actualizado' : 'Usuario añadido' },
  })

  return (
    <Box>
      <Text width="100%" fontSize="sm" variant="normal" mb="5">
        Llena los campos para {initialState ? ' actualizar ' : ' agregar '} este Usuario.
      </Text>
      <form>
        <Box position="relative" padding="2" mb={3}>
          <Divider />
          <AbsoluteCenter bg="white" px="4">
            Datos
          </AbsoluteCenter>
        </Box>
        <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
          <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl
          variant="floating"
          isInvalid={Boolean(formik.errors.lastName && formik.touched.lastName)}
          my="1rem"
        >
          <Input placeholder=" " name="lastName" onChange={formik.handleChange} value={formik.values.lastName} />
          <FormLabel htmlFor="lastName">Apellido</FormLabel>
          <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={Boolean(formik.errors.email && formik.touched.email)} my="1rem">
          <Input placeholder=" " name="email" onChange={formik.handleChange} value={formik.values.email} type="email" />
          <FormLabel htmlFor="email">Correo</FormLabel>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={Boolean(formik.errors.fkRole && formik.touched.fkRole)} mt="1">
          <Box position="relative" padding="2" mb={3}>
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              Rol/Permisos
            </AbsoluteCenter>
          </Box>
          <Select
            placeholder="Seleccionar Rol"
            size="lg"
            onChange={formik.handleChange}
            value={formik.values.fkRole}
            name="fkRole"
            disabled={!formik.values.canBeDeleted}
          >
            {roles?.map((role) => {
              return (
                <option value={role.id} key={role.id}>
                  {role.name}
                </option>
              )
            })}
          </Select>
          <FormErrorMessage>{formik.errors.fkRole}</FormErrorMessage>
        </FormControl>
        <Button
          leftIcon={<IconPlus />}
          onClick={() => {
            onSubmit()
          }}
          loading={loadingSubmit}
          color="cyan"
          mt="lg"
          mb="lg"
          size="lg"
          mr="auto"
        >
          {initialState ? 'Actualizar' : 'Agregar'}
        </Button>
      </form>
    </Box>
  )
}
