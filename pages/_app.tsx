import "styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "components/layout/Layout";
import {
  AuthContextProvider,
  ThemeContextProvider,
  themeVM,
} from "context/Contexts";
import {
  FluentProvider,
  webLightTheme,
  webDarkTheme,
} from "@fluentui/react-components";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

function MyApp({ Component, pageProps }: AppProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContextProvider>
      <FluentProvider
        theme={themeVM.themeType === "dark" ? webDarkTheme : webLightTheme}
      >
        <SessionProvider>
          <div id='alert' />
          <Layout >
            <Component {...pageProps} />
          </Layout>
        </SessionProvider>
      </FluentProvider>
    </ThemeContextProvider>
  );
}

export default observer(MyApp);
