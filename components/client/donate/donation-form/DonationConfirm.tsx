import { FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { Group, Stack } from '@mantine/core'
import { useFormik } from 'formik'
import { CreateDonation } from '~/prisma/types'
import DonatorCard from '../latest-donators/DonatorCard'

interface Props {
  donation: CreateDonation
  formik: ReturnType<typeof useFormik<CreateDonation>>
}

export const DonationConfirm = ({ donation, formik }: Props) => {
  return (
    <Stack spacing="lg" mx="md">
      <Text>
        Para finalizar, puedes dejarnos tu correo para enviarte un mensaje de agradecimiento apenas verifiquemos tu
        donativo :
      </Text>
      <FormControl isInvalid={Boolean(formik.errors.email && formik.touched.email)}>
        <FormLabel htmlFor="email">Correo {'(opcional)'}</FormLabel>
        <Input
          placeholder="tu-correo@mail.com"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email as string}
        />
        {formik.errors.email && formik.touched.email && <FormErrorMessage>{formik.errors.email}</FormErrorMessage>}
      </FormControl>
      <Group mt="lg" position="apart" align="start">
        <Text>Así aparecerá tu donativo:</Text>
        <Text>
          <b>Referencia de pago </b>
          <br /> {donation.reference}
        </Text>
      </Group>
      <DonatorCard
        marginY="5"
        marginX="auto"
        width="375px"
        maxWidth="100%"
        name={donation.name || 'Anónimo'}
        amount={donation.amount}
        comment={donation.message || ''}
        date={new Date()}
      />
    </Stack>
  )
}
