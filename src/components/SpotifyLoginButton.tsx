import { Button, Image, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconBrandSpotify } from "@tabler/icons";
import getConfig from "next/config";
import Link from "next/link";
import { SPOTIFY_BLACK, SPOTIFY_GREEN } from "../constants";
import SpotifyLogo from '../../public/img/Spotify_Logo_RGB_Green.png';

export default function SpotifyLoginButton() {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();


  return <Button bg={SPOTIFY_BLACK} fullWidth onClick={() => { window.location.href = `${BACKEND_URL}/auth/login` }} variant="outline" style={{color: SPOTIFY_GREEN, borderColor: SPOTIFY_GREEN }}>Log in with <Image style={{ height: '70px', width: '70px', marginTop: '49px', marginLeft: '5px' }} src={SpotifyLogo.src} /></Button>
} 