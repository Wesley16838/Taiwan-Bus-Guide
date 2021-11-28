import '../../styles/globals.scss'
import type { AppProps } from 'next/app'
import MapProvider from '../context/mapProvider'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MapProvider>
      <Component {...pageProps} />
    </MapProvider>
  )
}

export default MyApp
