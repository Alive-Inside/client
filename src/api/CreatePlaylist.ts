import getConfig from "next/config";
import SpotifyUserData from "../types/SpotifyUserData";
import LoginRedirect from "../utils/login-redirect";

export default async function createPlaylist(
  eldersBirthYear: number,
  musicalPreference: string,
  spotifyUserData: SpotifyUserData
) {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  const jwt = localStorage.getItem("jwt");
  try {
    const response = await (
      await fetch(`${BACKEND_URL}/api/createPlaylist`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        method: "POST",
        body: JSON.stringify({
          name: `${spotifyUserData.name} ${eldersBirthYear} ${musicalPreference}`,
        }),
      })
    ).json();
    if (response.redirect) {
      LoginRedirect();
      return;
    }
    // if (response.error?.status === 401) {
    //   const { accessToken, refreshToken } = await RefreshToken(
    //     spotifyUserData.refreshToken
    //   );
    //   await createPlaylist(eldersBirthYear, musicalPreference, {
    //     ...spotifyUserData,
    //     accessToken,
    //     refreshToken,
    //   });
    //   return;
    // }
    const {
      id,
      external_urls: { spotify: playlistUrl },
    } = response;

    return { url: playlistUrl, id };
  } catch (e) {
    console.error("Error creating Playlist");
    console.error(e);
  }
}
