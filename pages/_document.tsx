import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'


const Document = () => {

  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles/globals.css" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html >
  )
}


export default Document;
