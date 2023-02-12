import { ActionIcon, Flex, Skeleton } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks"
import { IconPlayerPause, IconPlayerPlay, IconTriangle } from "@tabler/icons";
import { LARGE_SCREEN } from "../constants"
import {useEffect, useState} from 'react';

export default function SpotifyRow({onTogglePlaying, playing = false, loading = false, trackId, children }: {playing?: boolean, onTogglePlaying?: any, loading?: boolean, trackId?: string, children: any }) {
    // handle refresh token logic
    useEffect(() => {
        const spotifyUserData = JSON.parse(localStorage.getItem('spotifyUserData'));
    })
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    return (<Flex mb={5} style={{ width: '100%', lineHeight: '1', alignItems: 'center', height: '3.5rem', color: '#fff', backgroundColor: '#121212' }}>
        <Skeleton visible={loading}>
            <ActionIcon onClick={() => { onTogglePlaying(trackId)}} variant="transparent">
                {playing ? <IconPlayerPause fill="#fff"/>
                 : <IconPlayerPlay fill ="#fff"/>}
                 </ActionIcon>
                </Skeleton>{children}
            </Flex>)
}