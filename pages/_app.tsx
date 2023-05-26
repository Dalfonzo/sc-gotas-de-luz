import { ChakraProvider } from '@chakra-ui/react'

import type { AppProps } from 'next/app'
import 'react-big-calendar/lib/css/react-big-calendar.css'
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
    </ChakraProvider>
  )
}

export default MyApp
