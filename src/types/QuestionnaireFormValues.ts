import Artist from "./Artist";
import Track from "./Track";

type QuestionnaireFormValues = {
  earliestMusicLoved: Artist[];
  eldersFirstName: string;
  eldersBirthYear: number;
  musicalPreferences: string[];
  musiciansFromHeritage: Artist[];
  musiciansParentsListenedTo: Artist[];
  eldersFavoriteArtistsAsTeenager: Artist[];
  mostEmotionalMusicMemory: string;
  songsThatNobodyKnows: Track[];
  songsWithEmotionalMemories: Track[];
  songsThatMakeYouCry: Track[];
  specialSongs: Track[];
  canYouRecallEarliestMusicLoved: boolean;
  isEthnicMusicImportant: boolean;
};

export default QuestionnaireFormValues;
