import { useEffect, useState } from "react";
import PlaylistModule from "../components/PlaylistModule";
import Questions from "../components/Questions";
import { getSpotifyUserData } from "../AppShell";
import Track from "../types/Track";
import { set } from "lodash";
import SpotifyUserData from "../types/SpotifyUserData";
import { Center, Container, Flex } from "@mantine/core";
import { useRouter } from "next/router";

export default function QuickList() {
  const [spotifyUserData, setSpotifyUserData] = useState<SpotifyUserData>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const router = useRouter();
  const [key, setKey] = useState(0);

  const remountComponent = () => {
    setKey((prevKey) => prevKey + 1); // Change the key to force remount
  };

  useEffect(() => {
    const spotifyUserData = getSpotifyUserData();
    setSpotifyUserData(JSON.parse(localStorage.getItem("spotifyUserData")));
    console.log(spotifyUserData);
  }, []);

  function onAddTrack(track: Track) {
    setTracks([...tracks, track]);
  }

  function onRemoveTrack(track: Track) {
    setTracks(tracks.filter((t) => t.id !== track.id));
  }

  function startAgain() {
    localStorage.removeItem("previouslyGeneratedTracks");
    localStorage.removeItem("sessionNotes");
    localStorage.removeItem("formQuestionsAndAnswers");
    localStorage.removeItem("exportedSpotifyPlaylist");
    setTracks([]);

    remountComponent();
  }

  return (
    <>
      <Center h="70vh">
        <PlaylistModule
          key={key}
          initialItems={[]}
          searchType={{ item: "track", multiple: true }}
          spotifyUserData={spotifyUserData}
          addTrack={onAddTrack}
          removeTrack={onRemoveTrack}
          isFinalPlaylist={true}
          startAgain={startAgain}
          isQuickList={true}
        />
      </Center>
    </>
  );
}
