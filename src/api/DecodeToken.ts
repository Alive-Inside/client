import getConfig from "next/config";

export default async function DecodeToken(token: string) {
  const {
    publicRuntimeConfig: { BACKEND_URL },
  } = getConfig();
  const response = await fetch(`${BACKEND_URL}/decode-token?token=${token}`);
  if (response) {
    return await response.json();
  }
}
