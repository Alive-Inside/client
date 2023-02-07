import { stringify } from "querystring";
import Track from "../types/Track";
import { getSpotifyHeaders } from "../../public/utils/utils";
import GetAlbum from "./GetAlbum";
import LoginRedirect from "../utils/login-redirect";
import { showErrorNotification } from "../utils/notifications";
import getConfig from "next/config";

export default async function GetTrack(
  trackId: string,
  accessToken: string
): Promise<Track> {
  try {
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    const response = await (
      await fetch(`${BACKEND_URL}/api/getTrack/${trackId}`, {
        headers: getSpotifyHeaders(accessToken),
      })
    ).json();
    return {
      mp3PreviewUrl: response.preview_url,
      id: response.id,
      url: response.external_urls.spotify,
      title: response.name as string,
      uri: response.uri as string,
      artist: {
        id: response.artists[0].id,
        name: response.artists[0].name,
        url: response.artists[0].external_urls.spotify as string,
      },
      album: {
        name: response.album.name,
        id: response.album.id,
        largeImageUrl: response.album.images[0].url as string,
        smallImageUrl: response.album.images[response.album.images.length - 1]
          .url as string,
        releaseYear: parseInt(response.album.release_date.split("-")[0]),
      },
    } as Track;
  } catch (e) {}
}
