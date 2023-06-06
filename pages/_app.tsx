import { ChakraProvider } from '@chakra-ui/react'

import type { AppProps } from 'next/app'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-quill/dist/quill.snow.css'
import theme from 'theme/theme'
import Fonts from '~/theme/foundations/fonts'
import '../styles/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  // FIXME: CHeck if this any can be improved
  const ChildComponent = Component as any
  return (
    <ChakraProvider theme={theme}>
      <Fonts />
      <ChildComponent {...pageProps} />
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v17.0"
        nonce="IVSYEDcT"
      ></script>
    </ChakraProvider>
  )
}

export default MyApp
