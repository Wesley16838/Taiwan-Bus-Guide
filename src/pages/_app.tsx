import '../../styles/globals.scss'
import type { AppProps } from 'next/app'
import BusProvider from '../context/busProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BusProvider>
      <Component {...pageProps} />
    </BusProvider>
  )
}

export default MyApp
