import { AppProps } from "next/app";
import Head from "next/head";
import { BackgroundImage, MantineProvider } from "@mantine/core";
import { NotificationsProvider } from '@mantine/notifications';
import '../../public/style.css'
import AppShell from "../AppShell";
import SpotifyUserData from "../types/SpotifyUserData";
import { useEffect, useState } from "react";
import { NavigationProgress } from "@mantine/nprogress";
import * as FullStory from '@fullstory/browser';
import backgroundImage from '../../public/lady-with-headset.jpg'
import { ModalsProvider } from "@mantine/modals";

export default function App(props: AppProps) {
  const { Component, pageProps } = props;
  const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);

  useEffect(() => {
    FullStory.init({ orgId: process.env.FULLSTORY_ORG_ID });
  }, [])
  return (
    <>
      <Head>
        <title>Alive Inside App</title>
        <link rel="shortcut icon" href="/favicon.ico" />
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
            cardBackground: ['rgba(20,20,28,0.85)']
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
            },
            text: {
              color: 'rgb(217,214,209)'
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
