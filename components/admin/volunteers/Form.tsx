import { Box, Flex, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, Link, Text } from '@chakra-ui/react'
import { Button, Group, List, ThemeIcon } from '@mantine/core'
import { Volunteer } from '@prisma/client'
import { IconExternalLink, IconPlus, IconQuestionMark } from '@tabler/icons-react'
import { useFormik } from 'formik'
import NextLink from 'next/link'
import * as Yup from 'yup'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateVolunteer } from '~/prisma/types'
import { responsiveProperty } from '~/theme/utils'
import { LINKS } from '~/utils/constants'

interface EventFormProps {
  initialState?: Volunteer | null
  onSuccess: () => void
}

export default function VolunteersForm({ initialState, onSuccess }: EventFormProps) {
  const customFetcher = useFetcherInstance()

  const formik = useFormik<CreateVolunteer>({
    initialValues: {
      name: initialState?.name || '',
      email: initialState?.email || '',
      phone: initialState?.phone || '',
      birthDate: initialState?.birthDate || '',
      formReference: undefined,
    },
    validationSchema: Yup.object<CreateVolunteer>({
      name: Yup.string().trim().required('El nombre del voluntario es requerido'),
      email: Yup.string().trim().email('Correo inválido').required('EL correo del voluntario es requerido'),
      phone: Yup.string()
        .min(8, 'Teléfono inválido')
        .max(20, 'Teléfono inválido')
        .required('El teléfono del voluntario es requerido'),
      birthDate: Yup.string().required('La fecha de nacimiento es requerida'),
    }),
    onSubmit: async (values) => {
      if (initialState) {
        await customFetcher.put(`/api/admin/volunteers/${initialState.id}`, values)
      } else {
        await customFetcher.post('/api/admin/volunteers', values)
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
      {!initialState && (
        <Box>
          <Group spacing={5} align="center">
            <ThemeIcon size={20} radius="xl">
              <IconQuestionMark />
            </ThemeIcon>
            <Text>Cómo registrar voluntarios</Text>
          </Group>
          <List fz="sm" mb="2rem" ml="lg">
            <List.Item>
              <Group spacing="xs">
                <span>
                  <u>Si no conoces sus datos</u>: invita al voluntario a llenar el{' '}
                </span>
                <Link as={NextLink} color="cyan.600" href={LINKS.VOLUNTEER_FORM} target="_blank">
                  <Group color="cyan" spacing={3}>
                    <span>formulario de Google</span>
                    <IconExternalLink size="16" />
                  </Group>
                </Link>
              </Group>
            </List.Item>
            <List.Item>
              <u> Si conoces sus datos</u>: llena estos campos para registrar al voluntario.
            </List.Item>
          </List>
        </Box>
      )}
      <form>
        <Flex gap={6} flexDirection="column" maxWidth="95%" mx="auto">
          <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
            <Input
              placeholder="Nombre Apellido"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
            <FormLabel htmlFor="title">Nombre completo</FormLabel>
            <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.email && formik.touched.email)}>
            <Input
              placeholder="ejemplo@mail.com"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <FormLabel htmlFor="title">Correo electrónico</FormLabel>
            <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
          </FormControl>
          <InputGroup flexWrap="wrap" justifyContent="space-between">
            <FormControl
              w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.phone && formik.touched.phone)}
            >
              {' '}
              <Input
                placeholder="+584141234567 "
                name="phone"
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
              <FormLabel htmlFor="start">Número de teléfono </FormLabel>
              <FormErrorMessage>{formik.errors.phone}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.birthDate && formik.touched.birthDate)}
            >
              {' '}
              <Input type="date" name="birthDate" onChange={formik.handleChange} value={formik.values.birthDate} />
              <FormLabel htmlFor="end">Fecha de nacimiento </FormLabel>
              <FormErrorMessage>{formik.errors.birthDate}</FormErrorMessage>
            </FormControl>
          </InputGroup>

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
        </Flex>
      </form>
    </Box>
  )
}
