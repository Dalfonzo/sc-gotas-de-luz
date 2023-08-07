import { Box, FormControl, FormErrorMessage, FormLabel, Input, Select, Text } from '@chakra-ui/react'
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
}

export default function Form({ onSuccess, roles, initialState }: Props) {
  const customFetcher = useFetcherInstance()
  console.log({ initialState })
  const formik = useFormik<InitialValues>({
    initialValues: {
      name: initialState?.name || '',
      lastName: initialState?.lastName || '',
      email: initialState?.email || '',
      // TODO: FIX
      ...(!initialState && { password: '' }),
      fkRole: initialState?.fkRole || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('El nombre es requerido').max(20, 'Máximo 20 caracteres'),
      lastName: Yup.string().trim().required('El apellido es requerido').max(20, 'Máximo 20 caracteres'),
      email: Yup.string().trim().required('El correo es requerido').max(20, 'Máximo 20 caracteres'),
      ...(!initialState && {
        password: Yup.string().trim().required('La contraseña es requerida').max(20, 'Máximo 20 caracteres'),
      }),
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
    // TODO: FIX THISSSS
    validateOnChange: false,
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
        <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name)}>
          <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
          <FormLabel htmlFor="name">Nombre</FormLabel>
          <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={Boolean(formik.errors.lastName)} my="1rem">
          <Input placeholder=" " name="lastName" onChange={formik.handleChange} value={formik.values.lastName} />
          <FormLabel htmlFor="lastName">Apellido</FormLabel>
          <FormErrorMessage>{formik.errors.lastName}</FormErrorMessage>
        </FormControl>
        <FormControl variant="floating" isInvalid={Boolean(formik.errors.email)} my="1rem">
          <Input placeholder=" " name="email" onChange={formik.handleChange} value={formik.values.email} />
          <FormLabel htmlFor="email">Correo</FormLabel>
          <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
        </FormControl>
        {!initialState && (
          <FormControl variant="floating" isInvalid={Boolean(formik.errors.password)} my="1rem">
            <Input
              placeholder=" "
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
              type="password"
            />
            <FormLabel htmlFor="password">Contraseña</FormLabel>
            <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
          </FormControl>
        )}
        <FormControl isInvalid={Boolean(formik.errors.fkRole)} my="1rem">
          <Select
            placeholder="Seleccionar Rol"
            size="lg"
            onChange={formik.handleChange}
            value={formik.values.fkRole}
            name="fkRole"
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
          disabled={!formik.isValid || !formik.dirty}
          loading={loadingSubmit}
          color="cyan"
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
