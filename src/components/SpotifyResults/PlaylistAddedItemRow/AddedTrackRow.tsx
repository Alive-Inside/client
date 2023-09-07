import { ActionIcon, Button, Center, Container, Flex, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../../constants";
import { LoadableTrack } from "../../../types/Track";
import SpotifyRow from "../../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../../public/no_spotify_avatar.png';
import { CurrentlyPlaying } from "../../PlaylistModule";
import MetadataLink from "../../MetadataLink";
import { ALBUM_COVER_DELAY, TRANSITION_TYPE } from "../TooltipConfig";

export default function AddedTrackRow({ track, ringProgress, onAddFive, onRemoveTrack, isFinalPlaylist, fiveTracksLoading, currentlyPlaying, onTogglePlaying }: { ringProgress: number, currentlyPlaying: CurrentlyPlaying, onTogglePlaying: (trackID: string, mp3PreviewUrl: string) => void, fiveTracksLoading: boolean, track: LoadableTrack, onAddFive?: Function, onRemoveTrack: Function, isFinalPlaylist?: boolean }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <SpotifyRow ringProgress={ringProgress} track={track} onTogglePlaying={onTogglePlaying} buffering={['buffering', 'initial buffer'].includes(currentlyPlaying?.state) && currentlyPlaying?.trackId == track.id} playing={currentlyPlaying?.trackId === track.id && currentlyPlaying.state === 'playing'} key={track.id}>
            <Flex dir="left" justify="start" align={'center'} style={{ flex: 1 }}>
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                    <Skeleton visible={track.loading === true}>
                        <Tooltip position="top" radius='sm' withinPortal={true} transition={TRANSITION_TYPE} openDelay={ALBUM_COVER_DELAY} label={`View ${track.title} on Spotify`}>
                            <div>
                                <a target="_blank" href={track.url} rel='noreferrer'>
                                    <Image height={50} width={50} alt="album cover" src={track.album.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
                                </a>
                            </div>
                        </Tooltip>
                    </Skeleton>
                </div>
                <Stack w={'100vw'} style={{ overflowX: 'hidden', lineHeight: 0, width: largeScreen ? '45rem' : '50vw', }}>
                    <div style={{ width: '100vw', marginLeft: '1.25rem', textAlign: 'left' }}>
                        <Skeleton visible={track.loading === true} w='70%'>
                            <Text w={largeScreen ? '60rem' : '40vw'} truncate size='md'>
                                <span style={{ color: 'white' }}>
                                    <MetadataLink isTitle={true} href={track.url}>{track.title}</MetadataLink>
                                </span>
                                &nbsp;•&nbsp;
                                {track.album.url}
                                <MetadataLink href={track.album.url}>
                                    <Tooltip withinPortal={true} position="top" radius="sm" openDelay={1250} transition={"fade"} transitionDuration={300} closeDelay={0} label={track.album.name}>
                                        <span style={{ fontSize: '14px' }}>
                                            {track.album.name}
                                        </span>
                                    </Tooltip>
                                </MetadataLink>
                            </Text>
                            <br />
                        </Skeleton>
                        <Skeleton visible={track.loading === true} mt={4} w={'30%'}>
                            <MetadataLink href={track.artist.url}>
                                <Text w={largeScreen ? '18rem' : '40vw'} truncate size='xs'>{track.artist.name}</Text>
                            </MetadataLink>
                        </Skeleton>
                    </div>
                </Stack>
            </Flex>
            <Flex align={'center'} pos={'relative'} justify={'flex-end'}>
                {isFinalPlaylist &&
                    <Skeleton visible={track.loading === true} mt={4} circle radius={"xl"}><ActionIcon mr={'md'} radius="xl" onClick={() => { onAddFive(track.id) }} color="green" size="lg" variant="outline" disabled={fiveTracksLoading} loading={fiveTracksLoading}>
                        <Text size='md'>+5</Text>
                    </ActionIcon>
                    </Skeleton>
                }
                <Skeleton radius={'xl'} visible={track.loading === true}>
                    <Button radius={'xl'} onClick={() => { onRemoveTrack(track.id) }} size='xs' variant="outline" color="red">Remove</Button>
                </Skeleton>
            </Flex>
        </SpotifyRow>
    )
}