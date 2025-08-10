import type { AppProps } from "next/app";
import Head from "next/head";
import Search from "../components/Search";
import "../app/global.css";

interface CustomAppProps extends AppProps {
  pageProps: Record<string, unknown>;
}

export default function App({ Component, pageProps }: CustomAppProps) {
  return (
    <>
      <Head>
        <title>Markdown Viewer</title>
        <meta
          name="description"
          content="View markdown files in your directory"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/favicon-16x16.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/favicon-32x32.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.svg" />
      </Head>
      <Search />
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
