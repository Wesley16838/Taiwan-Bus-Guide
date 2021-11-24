import Head from 'next/head'
import { LayoutProps } from '../../types/components'
import Navbar from '../navbar'
import styles from '../../styles/components/Layout.module.scss'

export default function Layout({ children, pageTitle, description, previewImage, siteName }: LayoutProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <meta name="description" content={description} />

        <meta property="og:image" content={previewImage} key="ogimage" />
        <meta property="og:site_name" content={siteName} key="ogsitename" />
        <meta property="og:title" content={pageTitle} key="ogtitle" />
+       <meta property="og:description" content={description} key="ogdesc" />
        <title>{pageTitle}</title>
        <link href='https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css' rel='stylesheet' />
      </Head>
      <div className={styles.wrapper}>
        <Navbar/>
        {children}
      </div>
    </>
  )
}