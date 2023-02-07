import base64url from "base64url";
import getConfig from "next/config";
import LoginRedirect from "../utils/login-redirect";
import { showErrorNotification } from "../utils/notifications";

export default async function AddTracksToPlaylist(
  playlistId: string,
  trackURIs: string[],
  accessToken: string,
  position?: number
) {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  try {
    const response = await (
      await fetch(`${BACKEND_URL}/addTracksToPlaylist`, {
        method: "POST",
        body: JSON.stringify({ playlistId, trackURIs, position }),
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).json();
    if (response.redirect) {
      LoginRedirect();
      return;
    }
    if (response === undefined || response.error) {
      showErrorNotification("Error adding track to playlist");
      return;
    }
  } catch (e) {
    console.error("Error adding track");
    console.error(e);
  }
}
