import { ActionIcon, Center, Flex, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks"
import { IconPlayerPause, IconPlayerPlay, IconTriangle } from "@tabler/icons";
import { LARGE_SCREEN } from "../constants"
import { useEffect, useState } from 'react';
import { LoadableTrack } from "../types/Track";

export default function SpotifyRow({ onTogglePlaying, playing = false, children, track, }: { playing?: boolean, track?: LoadableTrack, onTogglePlaying?: any, loading?: boolean, children: any }) {
    // handle refresh token logic
    useEffect(() => {
        const spotifyUserData = JSON.parse(localStorage.getItem('spotifyUserData'));
    })
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    return (<Center>
        {track !== undefined &&
            <Skeleton visible={track.loading === true}>
                <ActionIcon onClick={() => {
                    if (track.mp3PreviewUrl === null) {
                        window.open(track.url)
                    } else {
                        onTogglePlaying(track.id, track.mp3PreviewUrl)
                    }
                }}
                    variant="transparent">
                    {playing ? <IconPlayerPause fill="#fff" />
                        : <IconPlayerPlay fill="#fff" />}
                </ActionIcon>
            </Skeleton>
        }
        {children}
    </Center>)
}