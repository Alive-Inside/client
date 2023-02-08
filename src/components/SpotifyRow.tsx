import { Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks"
import { LARGE_SCREEN } from "../constants"

export default function SpotifyRow({ children }: { children: any }) {
    const largeScreen = useMediaQuery(LARGE_SCREEN);
    return (<Flex mb={5} style={{ width: '100%', lineHeight: '1', alignItems: 'center', height: '3.5rem', color: '#fff', backgroundColor: '#121212' }}>{children}</Flex>)
}
