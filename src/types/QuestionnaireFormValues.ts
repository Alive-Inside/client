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
  songsThatMakeYouCry: Track[];
  canYouRecallFirstSongYouHeard: boolean;
  doYouHaveLifeEventsConnectedWithSongs: boolean;
  isEthnicMusicImportant: boolean;
};

export default QuestionnaireFormValues;
