import { Box, Text } from '@chakra-ui/react'
import { Button, Group, Stepper, ThemeIcon, Title, Transition } from '@mantine/core'
import { IconArrowLeft, IconArrowRight, IconInfoCircle } from '@tabler/icons-react'
import { format, formatISO, isDate, parse } from 'date-fns'
import { useFormik } from 'formik'
import Image from 'next/image'
import { useState } from 'react'
import * as Yup from 'yup'
import UiFeedback from '~/components/common/feedback/UiFeedback'
import { useCloudUpload } from '~/hooks/useCloudUpload'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateDonation } from '~/prisma/types'
import { MethodSelect } from '../donate-method/MethodSelect'
import DonationForm from './DonationForm'

const StepTitle = ({ children }: { children: string }) => (
  <Title align="center" mb="lg" size="h2">
    {children}
  </Title>
)
const MAX_STEPS = 2
const FORM_STEP = 1
interface Props {
  afterComplete?: () => any
}
export const DonationSteps = ({ afterComplete }: Props) => {
  const [activeStep, setActiveStep] = useState(0)
  const canProceed: (() => boolean)[] = [() => Number.isSafeInteger(formik.values.methodId), () => true, () => false]
  const nextStep = async () => {
    if (activeStep == FORM_STEP) {
      const success = await onSubmit()
      if (!success) return
    }
    setActiveStep((current) => (current < MAX_STEPS ? current + 1 : current))
  }
  const prevStep = () => {
    setActiveStep((current) => (current > 0 ? current - 1 : current))
  }
  const { onFileUpload } = useCloudUpload({ fileKey: 'donation' })
  const customFetcher = useFetcherInstance()
  const formik = useFormik<CreateDonation>({
    initialValues: {
      name: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      message: '',
      isAnon: false,
      reference: '',
      donation: undefined,
      methodId: NaN,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .trim()
        .test('name test', function (value) {
          if (!value && !formik.values.isAnon) {
            return this.createError({ message: 'El nombre es requerido', path: this.path })
          }
          return true
        }),
      message: Yup.string().trim().max(200, 'Límite de caracteres excedido'),
      reference: Yup.string()
        .trim()
        .required('Por favor, ingresa la referencia para comprobar tu donación')
        .min(3, 'El campo ingresado es muy corto'),
      donation: Yup.string().test('img test', function (value: any) {
        if (!value) {
          return this.createError({ path: this.path, message: 'La imagen del comprobante es requerida' })
        }
        return true
      }),
      date: Yup.date()
        .transform((_, originalValue) =>
          isDate(originalValue) ? originalValue : parse(originalValue, 'yyyy-MM-dd', new Date())
        )
        .typeError('Ingrese una fecha válida')
        .required()
        .min('1920-11-13', 'La fecha ingresada no es válida'),
      amount: Yup.number().min(1, 'El monto ingresado es inválido').required('Este campo es requerido'),
    }),
    onSubmit: async (values) => {
      const prepared = { ...values, date: formatISO(new Date(values.date)) }
      const parsed = await onFileUpload(prepared)
      if (!parsed) {
        return false
      }
      await customFetcher.post('/api/donation', parsed)
      return true
    },
  })

  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      const result = await formik.submitForm()
      return !!result
    },
    success: { message: 'Donación registrada' },
  })

  const onReset = () => {
    afterComplete && afterComplete()
    formik.resetForm()
    setActiveStep(0)
  }

  const ThankYou = (
    <Transition mounted={activeStep === MAX_STEPS} transition="pop" duration={400} timingFunction="ease">
      {(style) => (
        <Box style={style} marginY="5" display="flex" flexDir="column" alignItems="center">
          <StepTitle>¡Gracias por tu aporte!</StepTitle>
          <Image
            style={{ objectFit: 'contain', maxWidth: '95%', height: 'auto' }}
            alt="thank you image"
            src="/assets/img/thank-you.jpg"
            width={600}
            height={600}
            quality={100}
          />
          <Text size="18px" align="center">
            Verificaremos tu donación tan pronto como podamos para poder mostrarla en esta sección, ¡gracias!
          </Text>
          <Button mt="lg" onClick={onReset} size="lg" display="flex" variant="filled" color="cyan.4">
            Aceptar
          </Button>{' '}
        </Box>
      )}
    </Transition>
  )
  return (
    <Box>
      <Stepper active={activeStep}>
        <Stepper.Step>
          <StepTitle>Selecciona un medio para donar:</StepTitle>
          <MethodSelect onSelect={(id) => formik.setFieldValue('methodId', id)} selected={formik.values.methodId} />
          <Group position="right" mt="md" spacing={3}>
            <ThemeIcon variant="light" color="gray">
              <IconInfoCircle />
            </ThemeIcon>{' '}
            Realiza tu donación antes de continuar:
            <Text fontWeight="medium" align="right"></Text>
          </Group>
        </Stepper.Step>
        <Stepper.Step>
          <StepTitle>Registra tu donación:</StepTitle>
          <UiFeedback loadingItems={4} loadingType="skeleton" isLoading={loadingSubmit}>
            <DonationForm formik={formik} />
          </UiFeedback>
        </Stepper.Step>
        <Stepper.Step>{ThankYou}</Stepper.Step>
      </Stepper>
      {activeStep < MAX_STEPS && (
        <Group my="md" position="right">
          <Button
            leftIcon={<IconArrowLeft />}
            variant="outline"
            w={'9rem'}
            display="flex"
            color="cyan.4"
            onClick={prevStep}
            size="lg"
            maw="40%"
            disabled={loadingSubmit}
          >
            Atrás
          </Button>
          <Button
            onClick={nextStep}
            disabled={!canProceed[activeStep]()}
            size="lg"
            rightIcon={<IconArrowRight />}
            display="flex"
            variant="filled"
            color="cyan.4"
            maw="50%"
            loading={loadingSubmit}
          >
            Siguiente
          </Button>
        </Group>
      )}
    </Box>
  )
}
