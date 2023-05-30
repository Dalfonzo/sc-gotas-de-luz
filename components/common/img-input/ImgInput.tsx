import { Flex, FormControl, FormErrorMessage, FormLabel, Image, Input } from '@chakra-ui/react'
import type { useFormik } from 'formik'
import type { ChangeEvent } from 'react'

type FormValues = { [x: string]: any }

interface Props<Values extends FormValues> {
  label: string
  formik: ReturnType<typeof useFormik<Values>>
  formKey: Extract<keyof Values, string>
}
export function ImgInput<Values extends FormValues>({ label, formik, formKey }: Props<Values>) {
  const debounce = (e: ChangeEvent) => setTimeout(() => formik.handleChange(e), 250)
  return (
    <Flex gap="1rem" flexDirection={'column'} alignItems="center">
      <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors[formKey] && formik.touched[formKey])}>
        <Input placeholder=" " name={formKey} onChange={formik.handleChange} value={formik.values[formKey]} />
        <FormLabel htmlFor={formKey}>{label}</FormLabel>
        <FormErrorMessage>{formik.errors[formKey] as string}</FormErrorMessage>
      </FormControl>
      <Image
        src={formik.values[formKey]}
        alt={formik.touched[formKey] ? 'No se puede visualizar imagen' : 'Preview de imagen'}
        width="20rem"
        maxWidth="95%"
        objectFit="contain"
      ></Image>
    </Flex>
  )
}
