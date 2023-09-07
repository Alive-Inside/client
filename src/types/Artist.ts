interface Artist {
  fake?: boolean;
  id: string;
  name: string;
  smallImageUrl: string;
  largeImageUrl: string;
  nextPaginationUrl: string;
  url: string;
}

export default Artist;

export interface LoadableArtist extends Artist {
  loading?: boolean;
}
