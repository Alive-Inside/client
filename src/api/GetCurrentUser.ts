import getConfig from "next/config";

export default async function GetCurrentUser(): Promise<any> {
  try {
    const {
      publicRuntimeConfig: { BACKEND_URL },
    } = getConfig();
    const response = await (
      await fetch(`${BACKEND_URL}/spotify/getCurrentUser`, {
        credentials: "include",
      })
    ).json();
    localStorage.setItem(
      "spotifyUserData",
      JSON.stringify(response.spotifyUserData)
    );
    return response.user;
  } catch (e) {
    console.error(e);
  }
}
