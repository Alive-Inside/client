import { Button } from "@mantine/core";
import { IconBrandSpotify } from "@tabler/icons";
import getConfig from "next/config";
import Link from "next/link";

export default function SpotifyLoginButton() {
    const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();

    return <Button fullWidth onClick={() => { window.location.href = `${BACKEND_URL}/auth/login` }} variant="outline" color="green"><IconBrandSpotify style={{ marginRight: '5px' }} />Login with Spotify</Button>
} 