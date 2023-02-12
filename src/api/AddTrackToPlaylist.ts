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
  try {
    const jwt = localStorage.getItem("jwt");
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    await fetch(`${BACKEND_URL}/api/addTracksToPlaylist`, {
      method: "POST",
      body: JSON.stringify({ playlistId, trackURIs, position }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
    });
  } catch (e) {
    console.error(e);
    showErrorNotification("Error adding track to playlist");
  }
}
