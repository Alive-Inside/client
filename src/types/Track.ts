interface Track {
  id: string;
  title: string;
  mp3PreviewUrl: string;
  url: string;
  uri: string;
  artist: {
    id: string;
    name: string;
    url: string;
  };
  album: {
    largeImageUrl: string;
    smallImageUrl: string;
    releaseYear: number;
    id: string;
    name: string;
  };
}

export default Track;

export interface LoadableTrack extends Track {
  loading?: boolean;
}
