import {
  ActionIcon,
  Flex,
  Loader,
  RingProgress,
  Skeleton,
  ThemeIcon,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconBrowser, IconBrowserPlus, IconExternalLink, IconPlayerPause, IconPlayerPlay } from "@tabler/icons";
import { LARGE_SCREEN, SPOTIFY_GREEN } from "../constants";
import { useEffect } from "react";
import { LoadableTrack } from "../types/Track";
import {
  PLAYBACK_DELAY as PLAYBACK_DELAY,
  TOOLTIP_BORDER_RADIUS,
  TRANSITION_TYPE,
} from "./SpotifyResults/TooltipConfig";

export default function SpotifyRow({
  onTogglePlaying,
  buffering,
  ringProgress,
  playing = false,
  children,
  track,
}: {
  buffering?: boolean;
  ringProgress?: number;
  playing?: boolean;
  track?: LoadableTrack;
  onTogglePlaying: any;
  loading?: boolean;
  children: any;
}) {
  useEffect(() => {
    // Logic to handle refreshing token should be added here
    const spotifyUserData = JSON.parse(localStorage.getItem("spotifyUserData"));
  }, []);

  const largeScreen = useMediaQuery(LARGE_SCREEN);

  return (
    <Flex align="center" ml="xs" justify="start" dir="left" mb="md" mt="md">
      {track !== undefined && (
        <Tooltip
          hidden={track.title === "Fake title"}
          position="top"
          withinPortal={true}
          openDelay={PLAYBACK_DELAY}
          transition={TRANSITION_TYPE}
          label={playing ? "Pause" : `Play ${track.title} by ${track.artist.name}`}
          radius={TOOLTIP_BORDER_RADIUS}
        >
          <ActionIcon
            onClick={() => {
              if (track.mp3PreviewUrl === null) {
                window.open(track.url);
              } else {
                onTogglePlaying(track.id, track.mp3PreviewUrl);
              }
            }}
            variant="transparent"
            style={{ position: "relative", marginRight: "8px" }} // Ensure the icon and Skeleton are positioned relative to the container
          >
            {track.loading === true && ( // Show Skeleton only when track is loading
              <Skeleton
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1, // Ensure Skeleton is above the icon
                }}
              />
            )}
            {buffering ? (
              <Loader color={SPOTIFY_GREEN} />
            ) : playing ? (
              <RingProgress
                style={{ transform: "scale(40%)" }}
                size={125}
                rootColor="rgba(0,0,0,0)"
                sections={[{ value: ringProgress, color: SPOTIFY_GREEN }]}
                label={
                  <IconPlayerPause
                    style={{ transform: "scale(2.5)", marginLeft: "1.75rem" }}
                    fill="#fff"
                  />
                }
              ></RingProgress>
            ) : (
              (track.mp3PreviewUrl !== null ? <IconPlayerPlay fill="#fff" /> : <IconExternalLink/>)
            )}
          </ActionIcon>
        </Tooltip>
      )}
      {children}
    </Flex>
  );
}
