import { Button, useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { IconBrandSpotify } from "@tabler/icons";
import getConfig from "next/config";
import Link from "next/link";

export default function SpotifyLoginButton({ redirectToApp = false }) {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();

  const { colors: { spotifyGreen, spotifyBlack} } = useMantineTheme();

  const getColor = (color: 'green' | 'black') => color === 'green' ? spotifyGreen[0] : spotifyBlack[0]

  return <Button bg={getColor('black')} fullWidth onClick={() => { window.location.href = `${BACKEND_URL}/auth/login?redirectToApp=${redirectToApp}` }}  variant="outline" styles={theme => ({'root': {'color': getColor('green'), borderColor: getColor('green')}})}><IconBrandSpotify style={{ marginRight: '5px' }} />Login with Spotify</Button>
} 