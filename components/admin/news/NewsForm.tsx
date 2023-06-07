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
import { useRouter } from 'next/router'
import { FaEye } from 'react-icons/fa'
import * as Yup from 'yup'
import { BackButton } from '~/components/client/common/back-button/BackButton'
import { NewsArticle } from '~/components/client/news/article/Article'
import BasicModal from '~/components/common/Modal'
import { ApiImg } from '~/components/common/api-img/ApiImg'
import FileUpload from '~/components/common/file-upload/FileUpload'
import TextEditor from '~/components/common/text-editor/TextEditor'
import useSubmitHandler from '~/hooks/useSubmitHandler'
import { useFetcherInstance } from '~/lib/fetcher/fetcher-instance'
import { CreateNews } from '~/prisma/types'

interface NewsFormProps {
  initialState?: News & { img: any }
}

export default function NewsForm({ initialState }: NewsFormProps) {
  const customFetcher = useFetcherInstance()
  const router = useRouter()
  const parseValues = (values: CreateNews) => {
    const formData = new FormData()
    Object.entries({ title: values.title, news: values.news, content: values.content }).forEach(
      ([key, value]) => value && formData.append(key, value)
    )
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
      news: Yup.string().test('img test', function (value: any) {
        if (!value && !initialState) {
          return this.createError({ path: this.path, message: 'La portada es requerida' })
        }
        return true
      }),
    }),
    onSubmit: async (values) => {
      const parsed = parseValues(values)
      if (initialState) {
        await customFetcher.put(`/api/admin/news/${initialState.id}`, parsed)
      } else {
        await customFetcher.post('/api/admin/news', parsed)
      }
      router.replace('/admin/news')
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
      <BackButton />
      <Text variant="subtitle" as="h2" mx="0" marginTop={3} marginBottom="2rem">
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
              <Flex gap={5} align="center">
                <FileUpload
                  name="news"
                  label="Portada"
                  file={formik.values.news}
                  setFile={(file) => formik.setFieldValue('news', file)}
                />
                {initialState && !formik.values.news && (
                  <ApiImg url={initialState.img} alt="file" borderRadius="lg" w="5rem" h="5rem" objectFit="cover" />
                )}
              </Flex>
              <FormErrorMessage>{formik.errors.news}</FormErrorMessage>
            </FormControl>
            <Flex my="2rem" gap="5" height="3rem">
              <Button
                leftIcon={<AddIcon />}
                isLoading={loadingSubmit}
                onClick={() => onSubmit()}
                loadingText="Procesando"
                variant="btn-primary"
                width="11rem"
              >
                Añadir
              </Button>
              <Button
                width="11rem"
                leftIcon={<FaEye />}
                height="100%"
                variant="btn-white-border"
                onClick={onToggle}
                mb="2rem"
              >
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
