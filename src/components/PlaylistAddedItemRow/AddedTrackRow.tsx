import { ActionIcon, Button, Center, Container, Flex, Skeleton, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlayerPlay } from "@tabler/icons";
import Image from "next/image";
import { useState } from "react";
import { LARGE_SCREEN } from "../../constants";
import Track, { LoadableTrack } from "../../types/Track";
import SpotifyRow from "../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../public/no_spotify_avatar.png';
import { CurrentlyPlaying } from "../PlaylistModule";

export default function AddedTrackRow({ track, onAddFive, onRemoveTrack, isFinalPlaylist, fiveTracksLoading, currentlyPlaying, onTogglePlaying }: { currentlyPlaying: CurrentlyPlaying, onTogglePlaying: (trackID: string, mp3PreviewUrl: string) => void, fiveTracksLoading: boolean, track: LoadableTrack, onAddFive?: Function, onRemoveTrack: Function, isFinalPlaylist?: boolean }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <SpotifyRow mp3PreviewUrl={track.mp3PreviewUrl} trackId={track.id} loading={track.loading === true} onTogglePlaying={onTogglePlaying} playing={currentlyPlaying?.trackId === track.id && currentlyPlaying.state === 'playing'} key={track.id}>
            {/* {!isFinalPlaylist && <IconPlayerPlay style={{ marginLeft: '0.5em' }} />} */}
            <Skeleton visible={track.loading === true}>
                <Image style={{ marginLeft: '1.25rem' }} height={50} width={50} alt="album cover" src={track.album.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
            </Skeleton>
            <Stack w={largeScreen ? '20rem' : '50vw'} style={{ lineHeight: 0 }}>
                <Center>
                    <div style={{ width: '100vw', marginLeft: '1rem', textAlign: 'left' }}>
                        <Skeleton w="70%" radius="sm" visible={track.loading === true}><Text w={200} truncate size='md'>{track.title}</Text></Skeleton><br />
                        <Skeleton mt={4} radius="sm" visible={track.loading === true} w={'30%'}><Text w={100} truncate style={{ color: '#b3b3b3' }} size='xs'>{track.artist.name}</Text></Skeleton>
                    </div>
                </Center>
            </Stack>
            <Flex style={{ marginRight: '0.5rem', }}>
                {isFinalPlaylist &&
                    <Skeleton visible={track.loading === true} mt={4} circle radius={"xl"}><ActionIcon mr={'md'} radius="xl" onClick={() => { onAddFive(track.id) }} color="green" size="lg" variant="outline" disabled={fiveTracksLoading} loading={fiveTracksLoading}>
                        <Text size='md'>+5</Text>
                    </ActionIcon>
                    </Skeleton>
                }
                <Skeleton radius={'xl'} visible={track.loading === true}>
                    <Button radius={'xl'} style={{ display: 'flex', justifyContent: 'end', justifyItems: 'end', marginLeft: '0.5rem' }} onClick={() => { onRemoveTrack(track.id) }} size='xs' variant="outline" color="red">Remove</Button>
                </Skeleton>
            </Flex>
        </SpotifyRow>
    )
}