interface Artist {
  id: string;
  name: string;
  smallImageUrl: string;
  largeImageUrl: string;
  nextPaginationUrl: string;
}

export default Artist;

export interface LoadableArtist extends Artist {
  loading?: boolean;
}
