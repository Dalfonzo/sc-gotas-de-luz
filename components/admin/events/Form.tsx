import { TimeIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { Button } from '@mantine/core'
import { Event } from '@prisma/client'
import { IconPlus } from '@tabler/icons-react'
import { formatDistance, formatISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import FileUpload from '~/components/common/file-upload/FileUpload'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { formatDateTimeLocal } from '~/lib/mappers/map-dates'
import { CreateEvent } from '~/prisma/types'
import { responsiveProperty } from '~/theme/utils'

interface EventFormProps {
  initialState?: Event & { img: any }
  onSuccess: () => void
}

export default function EventsForm({ initialState, onSuccess }: EventFormProps) {
  const customFetcher = useFetcherInstance()
  const parseValues = (values: CreateEvent) => {
    const formData = new FormData()
    Object.entries({
      title: values.title,
      events: values.events,
      start: formatISO(new Date(values.start)),
      end: formatISO(new Date(values.end)),
      description: values.description,
    }).forEach(([key, value]) => value && formData.append(key, value))
    return formData
  }

  const formik = useFormik<CreateEvent>({
    initialValues: {
      title: '',
      description: '',
      events: undefined,
      start: '',
      end: '',
      ...initialState,
      ...(initialState && {
        start: formatDateTimeLocal(initialState.start),
        end: formatDateTimeLocal(initialState.end),
      }),
    },
    validationSchema: Yup.object<CreateEvent>({
      title: Yup.string().trim().required('El título es requerido'),
      description: Yup.string().trim().required('EL contenido del evento es requerido'),
      events: Yup.string().test('img test', function (value: any) {
        if (!value && !initialState) {
          return this.createError({ path: this.path, message: 'La imagen es requerida' })
        }
        return true
      }),
      start: Yup.string().required('La fecha de inicio es requerida'),
      end: Yup.string()
        .required('La fecha final es requerida')
        .test('end test', function (value: string) {
          const start = formik.values.start
          if (start && start > value) {
            return this.createError({ path: this.path, message: 'La fecha final debe ser después de la fecha inicial' })
          }
          return true
        }),
    }),
    onSubmit: async (values) => {
      const parsed = parseValues(values)
      if (initialState) {
        await customFetcher.put(`/api/admin/events/${initialState.id}`, parsed)
      } else {
        await customFetcher.post('/api/admin/events', parsed)
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
  const DateSpan = formik.values.start?.length && formik.values.end?.length && (
    <Flex align="center" mt="2" gap="1">
      <TimeIcon fontSize="12px" />{' '}
      <Text fontSize="smaller" fontWeight="thin">
        Duración: {formatDistance(new Date(formik.values.end), new Date(formik.values.start), { locale: es })}{' '}
      </Text>
    </Flex>
  )
  return (
    <Box>
      <Text width="100%" fontSize="sm" variant="normal" mb="5">
        Llena los campos para agregar este evento al <i>Calendario</i>.
      </Text>
      <form>
        <Flex gap={6} flexDirection="column" maxWidth="95%" mx="auto">
          <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.title && formik.touched.title)}>
            <Input placeholder=" " name="title" onChange={formik.handleChange} value={formik.values.title} />
            <FormLabel htmlFor="title">Título</FormLabel>
            <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
          </FormControl>
          <InputGroup flexWrap="wrap" justifyContent="space-between">
            <FormControl
              w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.start && formik.touched.start)}
            >
              {' '}
              <Input type="datetime-local" name="start" onChange={formik.handleChange} value={formik.values.start} />
              <FormLabel htmlFor="start">Inicio </FormLabel>
              <FormErrorMessage>{formik.errors.start}</FormErrorMessage>
            </FormControl>
            <FormControl
              w={responsiveProperty({ mobileSize: 100, desktopSize: 47, unit: '%', numOfBreakPoints: 2 })}
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.end && formik.touched.end)}
            >
              {' '}
              <Input type="datetime-local" name="end" onChange={formik.handleChange} value={formik.values.end} />
              <FormLabel htmlFor="end">Fin </FormLabel>
              <FormErrorMessage>{formik.errors.end}</FormErrorMessage>
            </FormControl>
            {DateSpan}
          </InputGroup>
          <FormControl
            variant="floating"
            isRequired
            isInvalid={Boolean(formik.errors.description && formik.touched.description)}
          >
            {' '}
            <Textarea
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              placeholder=" "
              size="lg"
            />
            <FormLabel htmlFor="description">Detalles </FormLabel>
            <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={Boolean(formik.errors.events && formik.touched.events)}>
            <Flex gap={5} align="center">
              <FileUpload
                name="events"
                label="Portada"
                file={formik.values.events}
                setFile={(file) => formik.setFieldValue('events', file)}
              />
              {initialState && !formik.values.events && (
                <ApiImg url={initialState.img} alt="file" borderRadius="lg" w="5rem" h="5rem" objectFit="cover" />
              )}
            </Flex>
            <FormErrorMessage>{formik.errors.events}</FormErrorMessage>
          </FormControl>

          <Button
            leftIcon={<IconPlus />}
            onClick={() => {
              onSubmit()
            }}
            loading={loadingSubmit}
            color="cyan"
            mb="lg"
            size="lg"
            mr="auto"
          >
            Agregar
          </Button>
        </Flex>
      </form>
    </Box>
  )
}
