import base64url from "base64url";
import LoginRedirect from "../utils/login-redirect";
import { showErrorNotification } from "../utils/notifications";

export default async function AddTracksToPlaylist(
  playlistId: string,
  trackURIs: string[],
  accessToken: string,
  position?: number
) {
  try {
    const response = await (
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?accessToken=${base64url.encode(
          accessToken
        )}&?uris=${trackURIs.join(",")}${
          position ? `&position=${position}` : ""
        }`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      )
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
