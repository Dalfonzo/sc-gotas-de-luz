import { AddIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { News } from '@prisma/client'
import { useFormik } from 'formik'
import { FaEye } from 'react-icons/fa'
import * as Yup from 'yup'
import { NewsArticle } from '~/components/client/news/article/Article'
import BasicModal from '~/components/common/Modal'
import FileUpload from '~/components/common/file-upload/FileUpload'
import TextEditor from '~/components/common/text-editor/TextEditor'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { getFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateNews } from '~/prisma/types'
import { responsiveProperty } from '~/theme/utils'

interface NewsFormProps {
  initialState?: News
}

export default function NewsForm({ initialState }: NewsFormProps) {
  const parseValues = (values: CreateNews) => {
    const formData = new FormData()
    Object.entries(values).forEach(([key, value]) => value && formData.append(key, value))
    return formData
  }
  const formik = useFormik<CreateNews>({
    initialValues: {
      title: '',
      content: '',
      news: undefined,
      ...initialState,
    },
    validationSchema: Yup.object<CreateNews>({
      title: Yup.string().trim().required('El título es requerido'),
      content: Yup.string().trim().required('EL contenido del artículo es requerido'),
      news: Yup.string().required('Imagen requerida'),
    }),
    onSubmit: async (values) => {
      const customFetcher = getFetcherInstance()
      const parsed = parseValues(values)
      if (initialState) {
        return await customFetcher.put(`/api/news/${initialState.id}`, parsed)
      }
      await customFetcher.post('/api/news', parsed)
      return true
    },
    validateOnBlur: true,
  })

  const { onSubmit, loadingSubmit } = useSubmitHandler<void>({
    callback: async () => {
      const result = await formik.submitForm()
      if (result) {
        formik.resetForm()
        return true
      }
    },
    success: { message: 'Noticia añadida' },
  })
  const { isOpen, onToggle } = useDisclosure()
  const Preview = (
    <BasicModal
      size="4xl"
      title={'Vista de artículo'}
      body={<NewsArticle news={{ ...formik.values, id: 1, date: new Date(), imgSrc: formik.values.news?.src }} />}
      visible={isOpen}
      onClose={onToggle}
    />
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
            <FormControl variant="" isRequired isInvalid={Boolean(formik.errors.content && formik.touched.content)}>
              {' '}
              <FormLabel htmlFor="content">Cuerpo </FormLabel>
              <TextEditor value={formik.values.content} onChange={(value) => formik.setFieldValue('content', value)} />
              <FormErrorMessage>{formik.errors.content}</FormErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={Boolean(formik.errors.news && formik.touched.news)}>
              <FileUpload
                name="news"
                label="Portada"
                file={formik.values.news}
                setFile={(file) => formik.setFieldValue('news', file)}
              />
              <FormErrorMessage>{formik.errors.news}</FormErrorMessage>
            </FormControl>
            <Flex my="2rem" gap="5" height="3rem">
              <Button
                leftIcon={<AddIcon />}
                isLoading={loadingSubmit}
                onClick={() => onSubmit()}
                loadingText="Procesando"
                variant="btn-primary"
              >
                Añadir
              </Button>
              <Button leftIcon={<FaEye />} height="100%" variant="btn-white-border" onClick={onToggle} mb="2rem">
                Visualizar
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </form>
      {Preview}
    </Box>
  )
}
