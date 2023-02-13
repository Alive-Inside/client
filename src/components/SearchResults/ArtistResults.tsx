import { Button, Center, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../constants";
import Artist, { LoadableArtist } from "../../types/Artist";
import Track from "../../types/Track";
import SpotifyRow from "../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../public/no_spotify_avatar.png'
export default function ArtistResults({ searchResults, existingArtistIDs, onAddArtist }: { searchResults: LoadableArtist[], existingArtistIDs: string[], onAddArtist: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    return (
        <>
            {searchResults.map(artist => {
                return <Center mt={10}>
                    <SpotifyRow key={artist.id}>
                        <Skeleton visible={artist.loading === true} circle>
                            <Image style={{ borderRadius: '100px' }} height={50} width={50} alt="album cover" src={artist.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
                        </Skeleton>
                        <Stack w={'100vw'} style={{ lineHeight: 0, width: largeScreen ? '20rem' : '50vw' }}>
                            <Center>
                                <div style={{ textAlign: 'left', width: '100vw', marginLeft: '1.25rem' }}>
                                    <Skeleton w={'70%'} visible={artist.loading === true}>
                                        <Text w={largeScreen ? '18rem' : '40vw'} truncate size='md'>{artist.name}</Text>
                                    </Skeleton>
                                </div>
                            </Center>
                        </Stack>
                        <Center>
                            <Skeleton radius={'xl'} visible={artist.loading === true}>
                                {existingArtistIDs.includes(artist.id) ?
                                    <Tooltip radius={'xl'} label={`Already Added`}>
                                        <Button data-disabled color="green" sx={{ '&[data-disabled]': { pointerEvents: 'all', backgroundColor: 'rgba(0,0,0,0)', opacity: '0.5', border: '1px solid rgb(64,192, 87)', color: 'rgb(64,192, 87)' } }} variant="outline" radius="xl" size='xs' style={{ textAlign: 'center', marginRight: '1em' }}>Added</Button>
                                    </Tooltip>
                                    :
                                    <Button radius='xl' variant="outline" color="green" onClick={() => { onAddArtist(artist) }} size='xs' style={{ textAlign: 'center', marginRight: '1em' }}>Add</Button>
                                }
                            </Skeleton>
                        </Center>
                    </SpotifyRow>
                </Center>
            })}
        </>
    )
}