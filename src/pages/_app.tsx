import { AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';
import '../../public/style.css'
import AppShell from "../AppShell";
import SpotifyUserData from "../types/SpotifyUserData";
import { useEffect, useState } from "react";
import { NavigationProgress } from "@mantine/nprogress";


export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);

  useEffect(() => {

  }, [])
  return (
    <>
      <Head>
        <title>Alive Inside</title>
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colors: {
            // ''
          },
          colorScheme: "dark",
          globalStyles: theme => ({
            body: {
              backgroundColor: '#121212',
              breakpoints: {
                xs: 500,
                sm: 800,
                md: 1000,
                lg: 1200,
                xl: 1400,
              },
            }
          })
        }}
      >
        <NavigationProgress />
        <NotificationsProvider>
          <AppShell>
            <Component {...pageProps} />
          </AppShell>
        </NotificationsProvider>
      </MantineProvider>
    </>
  );
}
