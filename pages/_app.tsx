import { ChakraProvider } from '@chakra-ui/react'
import { MantineProvider } from '@mantine/core'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-quill/dist/quill.snow.css'
import theme from 'theme/theme'
import { RouterTransition } from '~/components/common/router-transition/RouterTransition'
import Fonts from '~/theme/foundations/fonts'
import '../styles/styles.css'

function MyApp({ Component, pageProps }: AppProps) {
  // FIXME: CHeck if this any can be improved
  const ChildComponent = Component as any
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <RouterTransition />
      <ChakraProvider theme={theme}>
        <Fonts />
        <SessionProvider session={pageProps.session}>
          <ChildComponent {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
      <script
        async
        defer
        crossOrigin="anonymous"
        src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v17.0"
        nonce="IVSYEDcT"
      ></script>
    </MantineProvider>
  )
}

export default MyApp
