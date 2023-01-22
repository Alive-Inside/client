import getConfig from "next/config";

export default async function GetCurrentUser() {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  await fetch(`${BACKEND_URL}`);
}
