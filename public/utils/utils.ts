export const getSpotifyHeaders = (accessToken: string) => {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
};
