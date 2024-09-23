import getConfig from "next/config";
import SpotifyUserData from "../types/SpotifyUserData";
import LoginRedirect from "../utils/login-redirect";
export default async function createPlaylist({
  eldersFirstName,
  eldersBirthYear,
  musicalPreferences,
  customPlaylistName,
}: {
  eldersFirstName: string;
  eldersBirthYear: number;
  musicalPreferences: string[];
  customPlaylistName?: string;
}) {
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
          name:
            customPlaylistName !== undefined
              ? customPlaylistName
              : `${eldersFirstName} ${eldersBirthYear}`, // ${musicalPreferences}`,
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
    return response;
  } catch (e) {
    console.error("Error creating Playlist");
    console.error(e);
  }
}
