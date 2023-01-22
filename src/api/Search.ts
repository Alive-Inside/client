import _ from "lodash";
import Track from "../types/Track";
import SearchedArtistsResponse from "../responses/SearchedArtistsResponse";
import LoginRedirect from "../utils/login-redirect";
import getConfig from "next/config";

export default async function Search<T>(
  query: string,
  country: string,
  accessToken: string,
  options: { limit?: number; type?: "tracks" | "artists" }
): Promise<T> {
  try {
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    const response = await (
      await fetch(
        `${BACKEND_URL}/api/search/${
          options.type ?? "tracks"
        }?query=${query}&country=${country}${
          options.limit && "&limit=" + options.limit
        }`,
        {
          credentials: "include",
        }
      )
    ).json();
    if (response.redirect) {
      LoginRedirect();
      return;
    }
    return response;
  } catch (e) {
    console.error("Error searching");
    console.error(e);
  }
}
