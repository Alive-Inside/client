import getConfig from "next/config";
import { getSpotifyHeaders } from "../../public/utils/utils";

export default async function GetCurrentUser(): Promise<any> {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  const { accessToken } = JSON.parse(localStorage.getItem("tokens"));
  return await (
    await fetch(`${BACKEND_URL}/spotify/getCurrentUser`, {
      credentials: "include",
      headers: getSpotifyHeaders(accessToken),
    })
  ).json();
}
