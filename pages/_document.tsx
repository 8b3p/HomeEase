import { tokens } from '@fluentui/react-components'
import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/globals.css" />
      </Head>
      <body style={{ backgroundColor: tokens.colorNeutralBackground1 }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
