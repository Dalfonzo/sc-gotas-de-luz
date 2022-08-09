import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
} from '@chakra-ui/react'
import { isDate, parse } from 'date-fns'
import { useFormik } from 'formik'
import * as Yup from 'yup'

const DonationForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      last_name: '',
      id_number: '',
      donation_date: '',
      amount: '',
      comment: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().trim().required('Este campo es requerido').min(1, 'El campo ingresado es muy corto'),
      last_name: Yup.string().trim().required('Este campo es requerido').min(1, 'El campo ingresado es muy corto'),
      id_number: Yup.string().required('Este campo es requerido').min(6, 'El campo ingresado es muy corto'),
      donation_date: Yup.date()
        .transform((_, originalValue) =>
          isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date())
        )
        .typeError('Ingrese una fecha válida')
        .required()
        .min('1920-11-13', 'La fecha ingresada no es válida'),
      amount: Yup.number().min(0, 'El campo ingresado es inválido').required('Este campo es requerido'),
    }),
    onSubmit: async (values) => {
      // TODO: Add route to endpoint
      console.log(values)
    },
  })

  return (
    <Box as="section">
      <Text variant="subtitle" as="h2" margin="6rem 0 2rem 0">
        ¡Aparece aquí!
      </Text>
      <Text variant="normal" my="2rem">
        Si quieres que tu donativo sea mostrado aquí, completa el siguiente formulario para que podamos verificarte y
        ¡listo!
      </Text>
      <form onSubmit={formik.handleSubmit} method="POST">
        <Flex gap={6} flexDirection="column" width="95%" margin="auto">
          <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
            <Input placeholder=" " name="name" onChange={formik.handleChange} value={formik.values.name} />
            <FormLabel htmlFor="name">Nombre</FormLabel>
            {formik.errors.name && formik.touched.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <FormControl
            variant="floating"
            isRequired
            isInvalid={Boolean(formik.errors.last_name && formik.touched.last_name)}
          >
            <Input placeholder=" " name="last_name" onChange={formik.handleChange} value={formik.values.last_name} />
            <FormLabel htmlFor="last_name">Apellido</FormLabel>
            {formik.errors.last_name && formik.touched.last_name && (
              <FormErrorMessage>{formik.errors.last_name}</FormErrorMessage>
            )}
          </FormControl>
          <HStack alignItems="flex-start">
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.id_number && formik.touched.id_number)}
            >
              <Input
                placeholder=" "
                name="id_number"
                onChange={formik.handleChange}
                value={formik.values.id_number}
                type="number"
              />
              <FormLabel htmlFor="id_number">Cédula</FormLabel>
              {formik.errors.id_number && formik.touched.id_number && (
                <FormErrorMessage>{formik.errors.id_number}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.donation_date && formik.touched.donation_date)}
            >
              <Input
                placeholder=" "
                name="donation_date"
                onChange={formik.handleChange}
                value={formik.values.donation_date}
                type="date"
              />
              <FormLabel htmlFor="donation_date">Fecha de donación</FormLabel>
              {formik.errors.donation_date && formik.touched.donation_date && (
                <FormErrorMessage>{formik.errors.donation_date}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.amount && formik.touched.amount)}
            >
              <InputGroup alignItems="center">
                <InputRightElement pointerEvents="none" fontSize="1.2em" top="unset">
                  $
                </InputRightElement>
                <Input
                  placeholder=" "
                  name="amount"
                  onChange={formik.handleChange}
                  value={formik.values.amount}
                  type="number"
                />
                <FormLabel htmlFor="amount">Monto</FormLabel>
              </InputGroup>
              {formik.errors.amount && formik.touched.amount && (
                <FormErrorMessage>{formik.errors.amount}</FormErrorMessage>
              )}
            </FormControl>
          </HStack>
          <FormControl
            variant="floating"
            isRequired
            isInvalid={Boolean(formik.errors.comment && formik.touched.comment)}
          >
            <Textarea
              placeholder=" "
              name="comment"
              onChange={formik.handleChange}
              value={formik.values.comment}
              rows={8}
              height="unset"
              minHeight="150px"
              _focus={{
                borderColor: 'aqua.light',
                boxShadow: '0 0 0 1px #60E0E3',
              }}
            />
            <FormLabel htmlFor="comment">Comentario</FormLabel>
            {formik.errors.comment && formik.touched.comment && (
              <FormErrorMessage>{formik.errors.comment}</FormErrorMessage>
            )}
          </FormControl>
          <Button type="submit" isLoading={false} loadingText="Procesando" variant="btn-primary" marginLeft="auto">
            Enviar
          </Button>
        </Flex>
      </form>
    </Box>
  )
}

export default DonationForm
