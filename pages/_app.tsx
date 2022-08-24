import { ChakraProvider } from '@chakra-ui/react'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import type { AppProps } from 'next/app'
import theme from 'theme/theme'
import Fonts from '~/theme/foundations/fonts'
import '../styles/styles.css'
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
