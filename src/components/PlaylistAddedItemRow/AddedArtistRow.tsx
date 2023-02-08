import { Button, Flex, Skeleton, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../constants";
import Artist from "../../types/Artist";
import SpotifyRow from "../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../public/no_spotify_avatar.png';

export default function AddedArtistRow({ artist, onRemoveArtist }: { artist: Artist, onRemoveArtist: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <SpotifyRow key={artist.id}>
            <Image style={{ borderRadius: '100px', marginLeft: '1.25rem' }} height={40} width={40} alt="album cover" src={artist.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
            <div style={{ display: 'flex', flexFlow: 'wrap', lineHeight: '0', flexDirection: 'column', marginLeft: '1.25rem', width: largeScreen ? '55%' : '40%', alignContent: 'start' }}>
                {<Text truncate style={{ maxWidth: "100%", textAlign: 'left' }} size='md'>{artist.name}</Text>}<br />
            </div>
            <Flex style={{ display: 'flex', marginRight: '0.5rem', justifyContent: 'end' }}>
                <Button radius={'xl'} style={{ display: 'flex', justifyContent: 'end', justifyItems: 'end' }} onClick={() => { onRemoveArtist(artist.id) }} size='xs' variant="outline" color="red">Remove</Button>
            </Flex>
        </SpotifyRow>
    )
}