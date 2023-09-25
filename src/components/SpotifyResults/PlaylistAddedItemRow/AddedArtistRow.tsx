import { Button, Center, Flex, Skeleton, Stack, Text, Tooltip } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Image from "next/image";
import { LARGE_SCREEN } from "../../../constants";
import Artist from "../../../types/Artist";
import SpotifyRow from "../../SpotifyRow";
import NO_SPOTIFY_AVATAR_IMAGE from '../../../../public/no_spotify_avatar.png';
import MetadataLink from "../../MetadataLink";
import { ALBUM_COVER_DELAY } from "../TooltipConfig";

export default function AddedArtistRow({ artist, onRemoveArtist }: { artist: Artist, onRemoveArtist: Function }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN)
    return (
        <SpotifyRow onTogglePlaying key={artist.id}>
            <Flex dir="left" justify="start" align="center" style={{ flex: 1 }}>
                <div style={{ position: 'relative', marginLeft: '0.5rem' }}>
                    <Tooltip position="top" withinPortal={true} radius="sm" openDelay={ALBUM_COVER_DELAY} transition="fade" label={`View ${artist.name} on Spotify`}>
                        <a href={artist.url} target="_blank" rel="noreferrer">
                            <Image style={{ borderRadius: '100px' }} height={50} width={50} alt={"Image of " + artist.name} src={artist.smallImageUrl || NO_SPOTIFY_AVATAR_IMAGE} />
                        </a>
                    </Tooltip>
                </div>
                <Stack w={largeScreen ? '45rem' : '50vw'} style={{  lineHeight: 0 }}>
                    <div style={{ width: '35%', marginLeft: '1.25rem', textAlign: 'left' }}>
                        <MetadataLink href={artist.url}>
                            <Text truncate w={largeScreen ? '18rem' : '80vw'} size="md">{artist.name}</Text><br />
                        </MetadataLink>
                    </div>
                </Stack>
            </Flex>
            <Flex align="center" pos="relative" justify="flex-end">
                <Button radius="xl" onClick={() => { onRemoveArtist(artist.id) }} size="xs" variant="outline" color="red">
                    Remove
                </Button>
            </Flex>
        </SpotifyRow>
    );
}