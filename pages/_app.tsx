import { ChakraProvider } from '@chakra-ui/react'
import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-quill/dist/quill.snow.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import theme from 'theme/theme'
import { ContextButton } from '~/components/admin/common/context-button/ContextButton'
import { RouterTransition } from '~/components/common/router-transition/RouterTransition'
import '../styles/styles.css'
import { DefaultSeo } from 'next-seo'
import { META } from '~/common/seo'
const inter = Inter({ subsets: ['latin'], display: 'swap' })

function MyApp({ Component, pageProps }: AppProps) {
  const ChildComponent = Component as any
  return (
    <main className={inter.className}>
      <DefaultSeo openGraph={META.openGraph} />
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <RouterTransition />
          <ChakraProvider theme={theme}>
            <SessionProvider session={pageProps.session}>
              <ChildComponent {...pageProps} />
              <ContextButton />
            </SessionProvider>
          </ChakraProvider>
          <script
            async
            defer
            crossOrigin="anonymous"
            src="https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v17.0"
            nonce="IVSYEDcT"
          ></script>
        </ModalsProvider>
      </MantineProvider>
    </main>
  )
}

export default MyApp
