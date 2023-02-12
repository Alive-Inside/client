import { ActionIcon, Button, Center, Flex, Group, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../constants";
import Track, { LoadableTrack } from "../../types/Track";
import SpotifyRow from "../SpotifyRow";
import NO_SPOTIFY_AVATAR from '../../../public/no_spotify_avatar.png';
import { CurrentlyPlaying } from "../PlaylistModule";
export default function TrackResults({ currentlyPlaying, onTogglePlaying, searchResults, onAddTrack: addTrack, existingTrackIDs }: { currentlyPlaying: CurrentlyPlaying, onTogglePlaying: (trackID: string, mp3PreviewUrl: string) => void, searchResults: LoadableTrack[], existingTrackIDs: string[], onAddTrack: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <>
            {searchResults.map(track => {
                return <SpotifyRow track={track} playing={currentlyPlaying?.trackId === track.id && currentlyPlaying.state === 'playing'} onTogglePlaying={onTogglePlaying} key={track.id}>
                    <Skeleton visible={track.loading === true}>
                        <Image style={{ marginLeft: '1.25rem' }} height={50} width={50} alt="album cover" src={track.album.smallImageUrl || NO_SPOTIFY_AVATAR} />
                    </Skeleton>
                    <Stack w={'100vw'} style={{ lineHeight: 0, width: largeScreen ? '20rem' : '50vw', }}>
                        <Center>
                            <div style={{ width: '100vw', marginLeft: '1rem', textAlign: 'left' }}>
                                <Skeleton visible={track.loading === true} w='70%'>
                                    <Text w={200} truncate size='md'>{track.title}</Text><br />
                                </Skeleton>
                                <Skeleton visible={track.loading === true} mt={4} w={'30%'}>
                                    <Text w={100} truncate style={{ color: '#b3b3b3', }} size='xs'>{track.artist.name}</Text>
                                </Skeleton>
                            </div>
                        </Center>
                    </Stack>
                    <Flex>
                        <Skeleton radius={'xl'} visible={track.loading === true}>
                            {existingTrackIDs.includes(track.id) ?
                                <Tooltip radius={'xl'} label={`Already Added`}>
                                    <Button data-disabled color="green" sx={{ '&[data-disabled]': { pointerEvents: 'all', backgroundColor: 'rgba(0,0,0,0)', opacity: '0.5', border: '1px solid rgb(64,192, 87)', color: 'rgb(64,192, 87)' } }} variant="outline" radius="xl" size='xs' style={{ textAlign: 'center', marginRight: '1em' }}>Added</Button>
                                </Tooltip>
                                :
                                <Button color="green" variant="outline" onClick={() => { addTrack(track) }} radius="xl" size='xs' style={{ textAlign: 'center', marginRight: '1em', }}>Add</Button>
                            }
                        </Skeleton>
                    </Flex>
                </SpotifyRow>
            })}
        </>
    )
}