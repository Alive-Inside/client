import Artist from "../types/Artist";

type SearchedArtistsResponse = {
  artists: Artist[];
  nextPaginationUrl: string;
};

export default SearchedArtistsResponse;
