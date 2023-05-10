// pages/_app.tsx
import Head from "next/head";
import { AppContext, AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import lightTheme from "@/styles/theme/lightTheme";
import { AppContextProvider, ThemeContextProvider, useInitAppVM, useInitThemeVM } from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import darkTheme from "@/styles/theme/darkTheme";
import Layout from "@/components/layout/Layout";
import { getSession, SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import '@/styles/globals.css'
import { House } from "@prisma/client";
import { useEffect, useState } from "react";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface props {
  isClient?: boolean
  initialState: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      house: House | null;
    } | null
  }
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  props: props
}

const MyApp = (appProps: MyAppProps) => {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache
  const [hasMounted, setHasMounted] = useState(false)
  const { Component, emotionCache = clientSideEmotionCache, pageProps, props } = appProps;
  const initialState = props?.initialState

  const themeVM = useInitThemeVM();
  const appVM = useInitAppVM(initialState, props?.isClient)

  console.log(initialState)

  useEffect(() => {
    if (!hasMounted) themeVM.hydrate();
    setHasMounted(true)
  }, [hasMounted, themeVM])

  return (
    <AppContextProvider value={appVM}>
      <ThemeContextProvider value={themeVM}>
        <SessionProvider session={pageProps?.session}>
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

MyApp.getInitialProps = async ({ ctx }: AppContext): Promise<{ props: props }> => {
  const session = await getSession(ctx);
  if (!ctx.req) return { props: { isClient: true, initialState: { user: null } } }
  if (!session) {
    return {
      props: {
        initialState: {
          user: null
        }
      }
    }
  }
  try {
    const res = await fetch(
      `http${process.env.NODE_ENV === "development" ? '' : ''}://${ctx.req?.headers.host}/api/users/${session?.user.id}/house`, {
      method: "GET",
      headers: { "cookie": ctx.req?.headers.cookie as string }
    })
    if (!res.ok) {
      return {
        props: {
          initialState: {
            user: null
          }
        }
      }
    }
    const data = await res.json();
    return {
      props: {
        initialState: {
          user: data.user
        }
      }
    }
  } catch (e: any) {
    console.log(e)
    return {
      props: {
        initialState: {
          user: null
        }
      }
    }
  }
}

export default observer(MyApp);
