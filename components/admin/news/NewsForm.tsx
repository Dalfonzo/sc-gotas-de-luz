import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Text } from '@chakra-ui/react'
import { News } from '@prisma/client'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import NewsCard from '~/components/client/news/card/Card'
import TextEditor from '~/components/common/text-editor/TextEditor'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { getFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateNews } from '~/prisma/types'
import { responsiveProperty } from '~/theme/utils'

interface NewsFormProps {
  initialState?: News
}

export default function NewsForm({ initialState }: NewsFormProps) {
  const formik = useFormik<CreateNews>({
    initialValues: {
      title: '',
      content: '',
      img: '',
      ...initialState,
    },
    validationSchema: Yup.object<CreateNews>({
      title: Yup.string().trim().required('El título es requerido'),
      content: Yup.string().trim().required('EL contenido del artículo es requerido'),
      img: Yup.string().trim().url('La imagen debe ser un enlace').required('Imagen requerida'),
    }),
    onSubmit: async (values) => {
      const customFetcher = getFetcherInstance()
      if (initialState) {
        return await customFetcher.put(`/api/news/${initialState.id}`, values)
      }
      await customFetcher.post('/api/news', values)
    },
    validateOnBlur: true,
  })
  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      await formik.submitForm()
      formik.resetForm()
    },
    success: { message: 'Noticia añadida' },
  })
  const Preview = (
    <Box mx="auto" maxWidth="95%">
      <NewsCard {...formik.values} date={new Date()} />
    </Box>
  )
  return (
    <Box>
      <Text
        variant="subtitle"
        as="h2"
        mx="0"
        marginTop={responsiveProperty({ mobileSize: 2, desktopSize: 6, unit: 'rem' })}
        marginBottom="2rem"
      >
        Añade un artículo
      </Text>
      <Text variant="normal" mt="2rem">
        Llena los campos para agregar este artículo a la sección de <i>Noticias</i>
      </Text>
      <form>
        <Flex wrap="wrap" alignItems="normal" my="1em">
          <Flex gap={6} flexDirection="column" width="60rem" maxWidth="95%" mx="auto" mt="2.5em">
            <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.title && formik.touched.title)}>
              <Input placeholder=" " name="title" onChange={formik.handleChange} value={formik.values.title} />
              <FormLabel htmlFor="title">Título</FormLabel>
              <FormErrorMessage>{formik.errors.title}</FormErrorMessage>
            </FormControl>
            {/* <ImgInput<CreateNews> label="Imagen (link)" formik={formik} formKey="img" /> */}
            <FormControl variant="floating" isRequired isInvalid={Boolean(formik.errors.img && formik.touched.img)}>
              <Input placeholder=" " name="img" onChange={formik.handleChange} value={formik.values.img} />
              <FormLabel htmlFor="img">Imagen (link)</FormLabel>
              <FormErrorMessage>{formik.errors.img}</FormErrorMessage>
            </FormControl>
            <FormControl
              variant="floating"
              isRequired
              isInvalid={Boolean(formik.errors.content && formik.touched.content)}
            >
              {' '}
              <FormLabel marginBottom="1em" htmlFor="title">
                Contenido del artículo
              </FormLabel>
              <TextEditor value={formik.values.content} onChange={(value) => formik.setFieldValue('content', value)} />
              <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
            </FormControl>
            <Button
              isLoading={loadingSubmit}
              onClick={() => onSubmit()}
              loadingText="Procesando"
              mb="2rem"
              variant="btn-primary"
            >
              Añadir
            </Button>
          </Flex>
          {Preview}
        </Flex>
      </form>
    </Box>
  )
}
