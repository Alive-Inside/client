import Track from "../types/Track";
import { getSpotifyHeaders } from "../../public/utils/utils";
import GetTrack from "./GetTrack";
import { DateTime } from "luxon";
import LoginRedirect from "../utils/login-redirect";
import { showErrorNotification } from "../utils/notifications";
import getConfig from "next/config";
import SpotifyUserData from "../types/SpotifyUserData";
import base64url from "base64url";

type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc["length"] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc["length"]]>;

type Range<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;

export default async function GetRecommendations(
  limit: Range<1, 101>,
  targetYear: number,
  countryCode: string,
  options: {
    artistIDs?: string[];
    trackIDs?: string[];
    genre?: string;
    duplicateTrackIDsToAvoid?: string[];
  }
): Promise<Track[]> {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  try {
    const { jwt } = JSON.parse(localStorage.getItem("spotifyUserData"));
    const response = await (
      await fetch(`${BACKEND_URL}/api/getRecommendations`, {
        method: "POST",
        body: JSON.stringify({ ...options, countryCode, targetYear, limit }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      })
    ).json();
    if (response === undefined || response.error) {
      showErrorNotification("Error loading recommendations");
      return;
    }
    if (response.redirect) {
      LoginRedirect();
      return;
    }
    return response.tracks;
  } catch (e) {
    console.error("Error getting Recommendations");
    console.error(e);
  }
}
