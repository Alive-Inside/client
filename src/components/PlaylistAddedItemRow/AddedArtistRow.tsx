import { Button, Center, Flex, Skeleton, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../constants";
import Artist from "../../types/Artist";
import SpotifyRow from "../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../public/no_spotify_avatar.png';

export default function AddedArtistRow({ artist, onRemoveArtist }: { artist: Artist, onRemoveArtist: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <Center mt={10}>
            <SpotifyRow key={artist.id}>
                <Image style={{ borderRadius: '100px', marginLeft: '1.25rem' }} height={40} width={40} alt="album cover" src={artist.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
                <Stack w={largeScreen ? '20rem' : '50vw'} style={{ lineHeight: 0 }}>
                    <Center>
                        <div style={{ width: '100vw', marginLeft: '1.25rem', textAlign: 'left' }}>
                            <Text truncate w={largeScreen ? '18rem' : '40vw'} size='md'>{artist.name}</Text><br />
                        </div>
                    </Center>
                </Stack>
                <Center>
                    <Button radius={'xl'} onClick={() => { onRemoveArtist(artist.id) }} size='xs' variant="outline" color="red">Remove</Button>
                </Center>
            </SpotifyRow>
        </Center>
    )
}