import { Button, Center, Flex, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../../public/no_spotify_avatar.png'
import { LARGE_SCREEN } from "../../../constants";
import SpotifyRow from "../../SpotifyRow";
import MetadataLink from "../../MetadataLink";
import { LoadableArtist } from "../../../types/Artist";
import { ARTIST_IMAGE_DELAY, TOOLTIP_BORDER_RADIUS, TRANSITION_TYPE } from "../TooltipConfig";

export default function ArtistResults({ searchResults, existingArtistIDs, onAddArtist }: { searchResults: LoadableArtist[], existingArtistIDs: string[], onAddArtist: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN);

    return (
        <>
            {searchResults.map(artist => (
                <SpotifyRow onTogglePlaying key={artist.id}>
                    <Flex align={'center'} dir="left" justify="start" style={{ flex: 1 }}>
                        <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                            {artist.loading === true && (
                                <Skeleton
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '100%'
                                    }}
                                />
                            )}
                            <Tooltip position="top" radius={TOOLTIP_BORDER_RADIUS} openDelay={ARTIST_IMAGE_DELAY} transition={TRANSITION_TYPE} label={`View ${artist.name} on Spotify`}>
                                <a href={artist.url} target='_blank' rel='noreferrer'>
                                    <Image style={{ borderRadius: '100px' }} height={50} width={50} alt={"Image of " + artist.name} src={artist.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
                                </a>
                            </Tooltip>
                        </div>
                        <Stack w={'100vw'} style={{ width: largeScreen ? '45rem' : '50vw' }}>
                            <div style={{ width: '35%', textAlign: 'left', marginLeft: '1.25rem' }}>
                                <Skeleton visible={artist.loading === true}>
                                    <MetadataLink href={artist.url}>
                                        <Text w={largeScreen ? '60rem' : '40vw'} truncate size='md'>{artist.name}</Text>
                                    </MetadataLink>
                                </Skeleton>
                            </div>
                        </Stack>
                    </Flex>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {artist.loading && (
                            <Skeleton radius={'xl'}
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
                        {existingArtistIDs.includes(artist.id) ? (
                            <Tooltip radius={'xl'} label={`Already Added`}>
                                <Button data-disabled color="green" sx={{ '&[data-disabled]': { pointerEvents: 'all', backgroundColor: 'rgba(0,0,0,0)', opacity: '0.5', border: '1px solid rgb(64,192, 87)', color: 'rgb(64,192, 87)' } }} variant="outline" radius="xl" size='xs' style={{ textAlign: 'center', marginRight: '1em' }}>Added</Button>
                            </Tooltip>
                        ) : (
                            <Button radius='xl' variant="outline" color="green" onClick={() => { onAddArtist(artist) }} size='xs' style={{ textAlign: 'center', marginRight: '1em' }}>Add</Button>
                        )}
                    </div>
                </SpotifyRow>
            ))}
        </>
    )
}
