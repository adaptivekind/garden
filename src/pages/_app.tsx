import type { AppProps } from 'next/app'
import Head from 'next/head'
import '../app/global.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Markdown Viewer</title>
        <meta
          name="description"
          content="View markdown files in your directory"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  )
}
