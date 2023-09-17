import { Button, Flex, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import NO_SPOTIFY_AVATAR from '../../../../public/no_spotify_avatar.png';
import { ADD_DELAY, ALBUM_COVER_DELAY, TOOLTIP_BORDER_RADIUS, TRANSITION_TYPE } from "../TooltipConfig";
import { LoadableTrack } from "../../../types/Track";
import { LARGE_SCREEN } from "../../../constants";
import { CurrentlyPlaying } from "../../PlaylistModule";
import SpotifyRow from "../../SpotifyRow";
import MetadataLink from "../../MetadataLink";

export default function TrackResults({ currentlyPlaying, onTogglePlaying, searchResults, onAddTrack: addTrack, existingTrackIDs }: { currentlyPlaying: CurrentlyPlaying, onTogglePlaying: (trackID: string, mp3PreviewUrl: string) => void, searchResults: LoadableTrack[], existingTrackIDs: string[], onAddTrack: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN);

    return (
        <>
            {searchResults.map(track => {
                return (
                    <SpotifyRow ringProgress={track.id === currentlyPlaying.trackId ? currentlyPlaying.ringProgress : null} track={track} buffering={['buffering', 'initial buffer'].includes(currentlyPlaying.state) && currentlyPlaying.trackId == track.id} playing={currentlyPlaying?.trackId === track.id && currentlyPlaying.state === 'playing'} onTogglePlaying={onTogglePlaying} key={track.id}>
                        <Flex dir="left" justify="start" align={'center'} style={{ flex: 1 }}>
                            <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                                {track.loading && (
                                    <Skeleton
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                        }}
                                    />
                                )}
                                <Tooltip position="top" radius='sm' withinPortal={true} transition={TRANSITION_TYPE} openDelay={ALBUM_COVER_DELAY} label={`View ${track.title} on Spotify`}>
                                    <a target="_blank" href={track.url} rel='noreferrer'>
                                        <Image height={50} width={50} alt="album cover" src={track.album.smallImageUrl || NO_SPOTIFY_AVATAR} />
                                    </a>
                                </Tooltip>
                            </div>
                            <Stack  style={{ maxWidth: "100%", overflowX: 'hidden' }}>
                                <div style={{ paddingLeft: '1.25rem', textAlign: 'left' }}>
                                    <Skeleton visible={track.loading === true} w='100%'>
                                        <div style={{width:"100%"}}>
                                            <span style={{ color: 'white', maxWidth: '30%', overflow: 'hidden' }}>
                                                <MetadataLink isTitle={true} href={track.url}>{track.title}</MetadataLink>
                                            </span>
                                            <span>&nbsp;•&nbsp;</span>
                                            <MetadataLink href={track.album.url}>
                                                <Tooltip withinPortal={true} position="top" radius="sm" openDelay={1250} transition={"fade"} transitionDuration={300} closeDelay={0} label={track.album.name}>
                                                    <span style={{ fontSize: '14px' }}>
                                                        {track.album.name}
                                                    </span>
                                                </Tooltip>
                                            </MetadataLink>
                                        </div>
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

                        <div style={{ position: 'relative', marginLeft: '1em', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {track.loading === true && (
                                <Skeleton
                                    radius={'xl'}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        zIndex: 1,
                                    }}
                                />
                            )}
                            {existingTrackIDs.includes(track.id) ? (
                                <Tooltip radius={'xl'} label={`Already Added`}>
                                    <Button
                                        data-disabled
                                        color="green"
                                        sx={{
                                            '&[data-disabled]': {
                                                pointerEvents: 'all',
                                                backgroundColor: 'rgba(0,0,0,0)',
                                                opacity: '0.5',
                                                border: '1px solid rgb(64,192, 87)',
                                                color: 'rgb(64,192, 87)',
                                            },
                                        }}
                                        variant="outline"
                                        radius="xl"
                                        size='xs'
                                        style={{ textAlign: 'center', marginRight: '1em' }}
                                    >
                                        Added
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Tooltip withinPortal={true} position={'top'} label='Add song' transition={TRANSITION_TYPE} openDelay={ADD_DELAY} radius={TOOLTIP_BORDER_RADIUS}>
                                    <Button
                                        color="green"
                                        variant="outline"
                                        onClick={() => { addTrack(track) }}
                                        radius="xl"
                                        size='xs'
                                        style={{ textAlign: 'center', marginRight: '1em' }}
                                    >
                                        Add
                                    </Button>
                                </Tooltip>
                            )}
                        </div>
                    </SpotifyRow >
                );
            })}
        </>
    );
}
