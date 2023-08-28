import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Switch,
  Textarea,
} from '@chakra-ui/react'
import { Text } from '@mantine/core'
import { useFormik } from 'formik'
import FileUpload from '~/components/common/file-upload/FileUpload'
import { CreateDonation } from '~/prisma/types'
interface Props {
  formik: ReturnType<typeof useFormik<CreateDonation>>
}
// TODO: update form
const DonationForm = ({ formik }: Props) => {
  return (
    <form>
      <Flex gap={6} flexDirection="column" width="95%" margin="auto">
        <FormControl isRequired={!formik.values.isAnon} isInvalid={Boolean(formik.errors.name && formik.touched.name)}>
          <FormLabel htmlFor="name">Nombre</FormLabel>

          <Input
            placeholder="Cómo quieres aparecer en tu donación"
            name="name"
            disabled={formik.values.isAnon}
            onChange={formik.handleChange}
            value={formik.values.name || undefined}
          />
          {formik.errors.name && formik.touched.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
        </FormControl>
        <FormControl flexWrap="wrap" display="flex" alignItems="center">
          <FormLabel htmlFor="isAnon">Donación anónima</FormLabel>

          <InputGroup gap={3} alignItems="center">
            <Text>Puedes optar para que tu donación se muestre sin nombre: </Text>
            <Switch
              size="lg"
              name="isAnon"
              id="isAnon"
              onChange={formik.handleChange}
              value={formik.values.isAnon as any}
            />
          </InputGroup>
        </FormControl>
        <FormControl isInvalid={Boolean(formik.errors.message && formik.touched.message)}>
          <FormLabel htmlFor="message">Mensaje</FormLabel>
          <Textarea
            placeholder="Incluye un mensaje para mostrar junto con tu donación"
            name="message"
            onChange={formik.handleChange}
            value={formik.values.message || undefined}
            rows={3}
            height="unset"
            minHeight="100px"
            _focus={{
              borderColor: 'aqua.light',
              boxShadow: '0 0 0 1px #60E0E3',
            }}
          />{' '}
          {formik.errors.message && formik.touched.message && (
            <FormErrorMessage>{formik.errors.message}</FormErrorMessage>
          )}
        </FormControl>
        <div>
          <FormLabel mb="5" variant="default" htmlFor="amount">
            Detalles
          </FormLabel>
          <Box alignItems="flex-start" display="flex" flexDir={{ base: 'column', md: 'row' }} gap={{ base: 6, md: 3 }}>
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.amount && formik.touched.amount)}
              // marginLeft={{ base: 0, md: '0.5rem' }}
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
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.date && formik.touched.date)}
              // marginLeft={{ base: 0, md: '0.5rem' }}
            >
              <Input
                placeholder=" "
                name="date"
                onChange={formik.handleChange}
                value={formik.values.date}
                type="date"
              />
              <FormLabel htmlFor="date">Fecha de donación</FormLabel>
              {formik.errors.date && formik.touched.date && <FormErrorMessage>{formik.errors.date}</FormErrorMessage>}
            </FormControl>
          </Box>
        </div>

        <FormControl isRequired isInvalid={Boolean(formik.errors.reference && formik.touched.reference)}>
          <FormLabel htmlFor="reference">Referencia</FormLabel>
          <Input
            placeholder="Código de referencia para verificar la donación"
            name="reference"
            onChange={formik.handleChange}
            value={formik.values.reference}
          />
          {formik.errors.reference && formik.touched.reference && (
            <FormErrorMessage>{formik.errors.reference}</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={Boolean(formik.errors.donation && formik.touched.donation)}>
          <FileUpload
            name="news"
            label="Comprobante"
            file={formik.values.donation}
            setFile={(file) => formik.setFieldValue('donation', file)}
          />
          {formik.errors.donation && formik.touched.donation && (
            <FormErrorMessage>{formik.errors.donation}</FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    </form>
  )
}

export default DonationForm
