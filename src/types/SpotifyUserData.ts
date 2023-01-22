type SpotifyUserData = {
  name: string;
  email: string;
  accessToken: string;
  countryCode: string;
  avatar?: string;
  refreshToken: string;
  userId: string;
  expiresAt: Date;
  isPremium: boolean;
};

export default SpotifyUserData;
