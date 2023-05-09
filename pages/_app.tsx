// pages/_app.tsx
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import lightTheme from "@/styles/theme/lightTheme";
import { AppContextProvider, ThemeContextProvider, useInitAppVM, useInitThemeVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import darkTheme from "@/styles/theme/darkTheme";
import Layout from "@/components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { NextPageContext } from "next";
import { IndexProps } from '@/pages/index'
import { Session } from "next-auth";
import '@/styles/globals.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface myNextPageContext extends NextPageContext {
  session?: Session | null
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  pageProps: IndexProps & myNextPageContext

}

const MyApp = (props: MyAppProps) => {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { initialState } = pageProps;

  const themeVM = useInitThemeVM();
  const appVM = useInitAppVM(initialState)

  return (
    <AppContextProvider value={appVM}>
      <ThemeContextProvider value={themeVM}>
        <SessionProvider session={pageProps.session}>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={themeVM.themeType === "light" ? lightTheme : darkTheme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Layout>
                <Component {...pageProps} />
                <Analytics />
              </Layout>
            </ThemeProvider>
          </CacheProvider>
        </SessionProvider>
      </ThemeContextProvider>
    </AppContextProvider>
  );
}

export default observer(MyApp);
