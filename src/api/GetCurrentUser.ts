import getConfig from "next/config";

export default async function GetCurrentUser(): Promise<any> {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  return await (
    await fetch(`${BACKEND_URL}/spotify/getCurrentUser`, {
      credentials: "include",
    })
  ).json();
}
