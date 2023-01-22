import LoginRedirect from "../utils/login-redirect";

export default async function GetAlbum(albumId: string, accessToken: string) {
  try {
    const response = await (
      await fetch(`https://api.spotify.com/v1/albums/${albumId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
    ).json();
    if (response.redirect) {
      LoginRedirect();
      return;
    }
    return { releaseYear: response.release_date, albumName: response.name };
  } catch (e) {
    console.error("Error getting album");
    console.error(e);
  }
}
