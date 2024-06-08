// pages/_app.tsx
import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
import lightTheme from "@/styles/theme/lightTheme";
import {
  AppContextProvider,
  initAppVM,
  ThemeContextProvider,
  useInitThemeVM,
} from "@/context/Contexts";
import { observer } from "mobx-react-lite";
import darkTheme from "@/styles/theme/darkTheme";
import Layout from "@/components/layout/Layout";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { House } from "@prisma/client";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "@/styles/globals.css";
import { useRouter } from "next/router";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface props {
  isClient?: boolean;
  initialState: {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      house: House | null;
    } | null;
  };
}

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  props: props;
}

const MyApp = (appProps: MyAppProps) => {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache

  const router = useRouter();
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    props,
  } = appProps;
  const initialState = props?.initialState;
  const [hasMounted, setHasMounted] = useState(false);

  const themeVM = useInitThemeVM();
  const appVM = initAppVM(initialState);

  useEffect(() => {
    if (!hasMounted) themeVM.hydrate();
    setHasMounted(true);
  }, [hasMounted, themeVM.themeType, themeVM]);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      NProgress.start();
    });
    router.events.on("routeChangeComplete", () => {
      NProgress.done();
    });
    router.events.on("routeChangeError", () => {
      NProgress.done();
    });
  }, [router]);

  return (
    <AppContextProvider value={appVM}>
      <ThemeContextProvider value={themeVM}>
        <SessionProvider session={pageProps?.session}>
          <CacheProvider value={emotionCache}>
            <Head>
              <meta
                name='viewport'
                content='initial-scale=1, width=device-width'
              />
            </Head>
            <ThemeProvider
              theme={themeVM.themeType === "light" ? lightTheme : darkTheme}
            >
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {themeVM.themeType === "dark" ? (
                <div id="background-image" />
              ) : (
                <div id="background-container" />
              )}
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
};

export default observer(MyApp);
