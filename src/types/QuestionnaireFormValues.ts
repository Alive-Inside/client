import Artist from "./Artist";
import Track from "./Track";

type QuestionnaireFormValues = {
  firstSongHeard: Track[];
  eldersFirstName: string;
  eldersBirthYear: number;
  musicalPreference: string;
  favoriteArtistsAsChild: Artist[];
  musiciansFromHeritage: Artist[];
  musiciansParentsListenedTo: Artist[];
  eldersFavoriteArtistsAsTeenager: Artist[];
  mostEmotionalMusicMemory: string;
  songsWithConnectedLifeEvents: Track[];
  songsThatNobodyKnows: Track[];
  songsWithEmotionalMemories: Track[];
  eldersMusicalMemories: string;
  canYouRecallFirstSongYouHeard: boolean;
  doYouHaveLifeEventsConnectedWithSongs: boolean;
  isEthnicMusicImportant: boolean;
};

export default QuestionnaireFormValues;
